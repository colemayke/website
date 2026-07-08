#!/usr/bin/env node
// Aggregates real Claude usage into public/claude-usage.json for the
// ClaudeActivity heatmap. Only daily *counts* are ever written — no prompts,
// responses, titles, project names, or session IDs. The public file is safe
// to commit; the raw transcripts and any chat export never leave your machine.
//
// Multi-machine safe: each computer writes its own per-host file under
// data/claude-usage/, and those are summed into public/claude-usage.json. So
// the workflow across machines is:
//
//   machine A:  npm run usage   → writes data/claude-usage/<A>.json  → commit + push
//   machine B:  git pull; npm run usage → adds data/claude-usage/<B>.json → commit
//
// Re-running on the same machine is idempotent (per-day counts are merged with
// a max, so history survives even after Claude Code prunes old transcripts).
//
// Sources:
//   1. Claude Code transcripts — ~/.claude/projects/**/*.jsonl (this machine)
//   2. Optional claude.ai export — data/claude-export/conversations.json
//      (claude.ai → Settings → Privacy → Export data; drop the file in, run,
//      then you can delete it — its counts persist in the per-source file).
//      data/claude-export/ is gitignored so raw conversations never commit.

import {existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {homedir, hostname} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = join(ROOT, 'public', 'claude-usage.json');
const SOURCES_DIR = join(ROOT, 'data', 'claude-usage');
const PROJECTS_DIR = join(homedir(), '.claude', 'projects');
const CHAT_EXPORT_PATH = join(ROOT, 'data', 'claude-export', 'conversations.json');

const EMPTY = () => ({messages: 0, codeTokens: 0, chatMessages: 0, chatTokens: 0});
const FIELDS = Object.keys(EMPTY());

// Local calendar date (matches how the heatmap builds its grid).
function ymd(date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function slug(text) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';
}

function* walkJsonl(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) yield* walkJsonl(path);
		else if (entry.endsWith('.jsonl')) yield path;
	}
}

function loadDays(path) {
	if (!existsSync(path)) return {};
	try {
		return JSON.parse(readFileSync(path, 'utf8')).days ?? {};
	} catch {
		return {};
	}
}

// Merge b into a, keeping the larger count per field so re-runs never lose
// history (a later scan sees more of today; an older scan preserved a pruned day).
function mergeMax(a, b) {
	for (const [day, counts] of Object.entries(b)) {
		a[day] ??= EMPTY();
		for (const field of FIELDS) a[day][field] = Math.max(a[day][field] ?? 0, counts[field] ?? 0);
	}
	return a;
}

function writeSource(name, days) {
	mkdirSync(SOURCES_DIR, {recursive: true});
	const sorted = Object.fromEntries(Object.entries(days).sort(([a], [b]) => a.localeCompare(b)));
	writeFileSync(
		join(SOURCES_DIR, `${name}.json`),
		JSON.stringify({generatedAt: new Date().toISOString(), days: sorted}, null, '\t') + '\n',
	);
	return Object.keys(sorted).length;
}

// --- 1. This machine's Claude Code transcripts ---
let codeRecords = 0;
if (existsSync(PROJECTS_DIR)) {
	const days = {};
	for (const file of walkJsonl(PROJECTS_DIR)) {
		for (const line of readFileSync(file, 'utf8').split('\n')) {
			if (!line) continue;
			let record;
			try {
				record = JSON.parse(line);
			} catch {
				continue;
			}
			if (!record.timestamp) continue;
			if (record.type !== 'user' && record.type !== 'assistant') continue;

			const key = ymd(new Date(record.timestamp));
			days[key] ??= EMPTY();
			days[key].messages += 1;
			codeRecords += 1;

			const usage = record.message?.usage;
			if (usage && typeof usage === 'object') {
				days[key].codeTokens +=
					(usage.input_tokens ?? 0) +
					(usage.output_tokens ?? 0) +
					(usage.cache_creation_input_tokens ?? 0) +
					(usage.cache_read_input_tokens ?? 0);
			}
		}
	}
	if (codeRecords > 0) {
		const name = `code-${slug(hostname())}`;
		// Merge with this host's prior file so pruned-away days stay counted.
		const merged = mergeMax(loadDays(join(SOURCES_DIR, `${name}.json`)), days);
		const count = writeSource(name, merged);
		console.log(`Claude Code (${name}): ${codeRecords} message(s) across ${count} day(s).`);
	}
}

// --- 2. Optional claude.ai chat export ---
let chatRecords = 0;
if (existsSync(CHAT_EXPORT_PATH)) {
	const days = {};
	for (const conversation of JSON.parse(readFileSync(CHAT_EXPORT_PATH, 'utf8'))) {
		for (const message of conversation.chat_messages ?? []) {
			if (!message.created_at) continue;
			const key = ymd(new Date(message.created_at));
			days[key] ??= EMPTY();
			days[key].chatMessages += 1;
			// The export has no token counts; ~4 chars per token is close enough.
			days[key].chatTokens += Math.round((message.text ?? '').length / 4);
			chatRecords += 1;
		}
	}
	if (chatRecords > 0) {
		const merged = mergeMax(loadDays(join(SOURCES_DIR, 'chat-export.json')), days);
		const count = writeSource('chat-export', merged);
		console.log(`claude.ai chat export: ${chatRecords} message(s) across ${count} day(s).`);
	}
}

// --- 3. Merge every per-source file → public/claude-usage.json ---
if (!existsSync(SOURCES_DIR)) {
	console.log('No Claude usage sources found; leaving', OUT_PATH, 'untouched.');
	process.exit(0);
}

const totals = {};
for (const file of readdirSync(SOURCES_DIR)) {
	if (file.endsWith('.json')) mergeMax(totals, loadDays(join(SOURCES_DIR, file)));
}

const days = Object.fromEntries(Object.entries(totals).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(
	OUT_PATH,
	JSON.stringify({generatedAt: new Date().toISOString(), days}, null, '\t') + '\n',
);

const dates = Object.keys(days);
console.log(
	`Wrote ${OUT_PATH}: ${dates.length} day(s) (${dates[0]} → ${dates.at(-1)}) ` +
		`merged from ${readdirSync(SOURCES_DIR).filter(f => f.endsWith('.json')).length} source(s).`,
);
