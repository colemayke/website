import clsx from 'clsx';
import {useInView} from 'framer-motion';
import {useEffect, useMemo, useRef, useState} from 'react';

// A GitHub-contribution-style heatmap, but for my Claude usage — styled to match
// the rest of the site (heavy iOS cards) and coloured with Claude's own coral
// scale instead of GitHub green. Cells sweep in left-to-right when the card
// scrolls into view.
//
// One combined view: cell intensity tracks message activity (chat + Claude Code
// + Claude Design), while both the message and token totals show in the header
// and per-day tooltips. Activity is the colour signal because agentic Claude
// Code days carry orders of magnitude more (cache-inclusive) tokens than chat
// days — colouring by tokens would wash the chat history out to nothing.
//
// Data is hybrid: real usage aggregated from Claude Code transcripts and an
// Anthropic data export lives in /claude-usage.json — refresh it with
// `npm run usage`. Days without real data fall back to a deterministic model
// seeded by the date, so the grid stays full and slides forward between
// refreshes without a redeploy. Intensity uses quantiles rather than fixed
// thresholds, so the real and modeled scales blend.

// Shape of one day in /claude-usage.json. `messages`/`codeTokens` are Claude
// Code; chat and design are tracked separately.
type RealDay = {
	messages?: number;
	codeTokens?: number;
	chatMessages?: number;
	chatTokens?: number;
	designMessages?: number;
	designTokens?: number;
};

type Day = {
	date: Date;
	messages: number;
	tokens: number;
	codeTokens: number;
	chatTokens: number;
	designTokens: number;
	level: number;
};

const DAY_MS = 86_400_000;

// Deterministic pseudo-random in [0, 1) from an integer seed.
function noise(seed: number): number {
	const x = Math.sin(seed * 12.9898) * 43_758.5453;
	return x - Math.floor(x);
}

function messagesForDay(date: Date, daysAgo: number): number {
	const dayNum = Math.floor(date.getTime() / DAY_MS);
	const dow = date.getDay();
	const isWeekend = dow === 0 || dow === 6;

	// A slow wave so usage clusters into busy and quiet stretches.
	const wave = 0.55 + 0.85 * noise(Math.floor(dayNum / 8) + 321);
	// A gentle upward trend — I lean on Claude more now than a year ago.
	const trend = 0.6 + 0.55 * (1 - daysAgo / 364);

	let count = noise(dayNum) * 78 * wave * trend * (isWeekend ? 0.5 : 1);

	// Leave a realistic share of days blank so the modeled stretch matches the
	// cadence of real usage (which isn't every single day) — otherwise the
	// fabricated past looks busier than the real present and the seam shows.
	if (noise(dayNum + 13) < 0.42) {
		count = 0;
	}

	return Math.round(count);
}

function chatTokensForDay(date: Date, messages: number): number {
	if (messages === 0) return 0;
	const dayNum = Math.floor(date.getTime() / DAY_MS);
	// Roughly 500–1,400 tokens per message, varying by day.
	return Math.round(messages * (520 + noise(dayNum + 7) * 880));
}

function codeTokensForDay(date: Date, daysAgo: number, messages: number): number {
	// Claude Code sessions ride along with active days — no chat, no coding.
	if (messages === 0) return 0;

	const dayNum = Math.floor(date.getTime() / DAY_MS);
	const dow = date.getDay();
	const isWeekend = dow === 0 || dow === 6;

	// Not every active day is a coding day (and weekends rarely are).
	if (noise(dayNum + 29) < (isWeekend ? 0.55 : 0.2)) {
		return 0;
	}

	// Coding clusters into project pushes, and ramps up over the year —
	// agentic sessions burn far more tokens than chat does.
	const push = 0.4 + 1.1 * noise(Math.floor(dayNum / 10) + 87);
	const trend = 0.45 + 0.75 * (1 - daysAgo / 364);

	return Math.round(noise(dayNum + 3) * 240_000 * push * trend);
}

function designTokensForDay(date: Date, daysAgo: number, messages: number): number {
	// Claude Design sessions also ride along with active days.
	if (messages === 0) return 0;

	const dayNum = Math.floor(date.getTime() / DAY_MS);
	const dow = date.getDay();
	const isWeekend = dow === 0 || dow === 6;

	// Design work comes in bursts too, though not every active day has one.
	if (noise(dayNum + 41) < (isWeekend ? 0.6 : 0.3)) {
		return 0;
	}

	// Iterating on mockups burns fewer tokens than agentic coding, but it adds up.
	const push = 0.4 + 1.1 * noise(Math.floor(dayNum / 9) + 53);
	const trend = 0.5 + 0.7 * (1 - daysAgo / 364);

	return Math.round(noise(dayNum + 11) * 120_000 * push * trend);
}

// Intensity buckets from quantiles of the year's non-zero days, so the scale
// adapts to whatever mix of real and modeled magnitudes is on the grid.
function quantileThresholds(values: number[]): [number, number, number] {
	const sorted = values.filter(v => v > 0).sort((a, b) => a - b);
	if (sorted.length === 0) return [1, 2, 3];
	const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]!;
	return [q(0.4), q(0.65), q(0.85)];
}

function levelFor(value: number, [t1, t2, t3]: [number, number, number]): number {
	if (value === 0) return 0;
	if (value < t1) return 1;
	if (value < t2) return 2;
	if (value < t3) return 3;
	return 4;
}

// Local calendar date key, matching scripts/generate-claude-usage.mjs.
function ymd(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

// Light: pale coral → deep clay. Dark: deep clay → bright coral. Level 0 is neutral.
const CELL_COLORS = [
	'bg-[#ECE7E3] dark:bg-neutral-800',
	'bg-[#F3CDB6] dark:bg-[#5A3221]',
	'bg-[#E7A47C] dark:bg-[#8A4B2C]',
	'bg-[#D97757] dark:bg-[#C0623C]',
	'bg-[#B14E2C] dark:bg-[#EC8A5D]',
];

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Per-cell wave timing: columns sweep left-to-right with a slight vertical cascade.
const WEEK_DELAY_MS = 16;
const ROW_DELAY_MS = 24;

function buildCalendar(realDays: Record<string, RealDay> | null) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const start = new Date(today);
	start.setDate(start.getDate() - 364);
	// Back up to the Sunday that starts that week, GitHub-style.
	start.setDate(start.getDate() - start.getDay());

	// Everything from the first real entry onward is real territory: a day
	// missing from the data there is a genuine zero, not a gap for the model.
	const firstRealKey = realDays ? Object.keys(realDays).sort()[0] : undefined;

	const days: Day[] = [];
	let firstRealDate: Date | null = null;
	for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
		const date = new Date(d);
		const daysAgo = Math.round((today.getTime() - date.getTime()) / DAY_MS);

		const key = ymd(date);
		if (realDays && firstRealKey && key >= firstRealKey) {
			if (!firstRealDate) firstRealDate = date;
			const real = realDays[key];
			const codeTokens = real?.codeTokens ?? 0;
			const chatTokens = real?.chatTokens ?? 0;
			const designTokens = real?.designTokens ?? 0;
			days.push({
				date,
				messages: (real?.messages ?? 0) + (real?.chatMessages ?? 0) + (real?.designMessages ?? 0),
				tokens: codeTokens + chatTokens + designTokens,
				codeTokens,
				chatTokens,
				designTokens,
				level: 0,
			});
			continue;
		}

		const messages = messagesForDay(date, daysAgo);
		const chatTokens = chatTokensForDay(date, messages);
		const codeTokens = codeTokensForDay(date, daysAgo, messages);
		const designTokens = designTokensForDay(date, daysAgo, messages);
		days.push({
			date,
			messages,
			tokens: chatTokens + codeTokens + designTokens,
			codeTokens,
			chatTokens,
			designTokens,
			level: 0,
		});
	}

	// Colour by message activity (see file header for why not tokens).
	const thresholds = quantileThresholds(days.map(day => day.messages));

	let totalMessages = 0;
	let totalTokens = 0;
	let best = days[0]!;
	let modeledDays = 0;
	for (const day of days) {
		day.level = levelFor(day.messages, thresholds);
		totalMessages += day.messages;
		totalTokens += day.tokens;
		if (day.messages > best.messages) best = day;
		if (firstRealDate && day.date < firstRealDate) modeledDays += 1;
	}

	const weeks: Day[][] = [];
	for (let i = 0; i < days.length; i += 7) {
		weeks.push(days.slice(i, i + 7));
	}

	// Current streak: consecutive days up to today with any activity.
	let streak = 0;
	for (let i = days.length - 1; i >= 0; i--) {
		if (days[i]!.messages > 0) streak++;
		else break;
	}

	return {weeks, totalMessages, totalTokens, best, streak, firstRealDate, modeledDays};
}

function formatDate(date: Date): string {
	return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
}

function formatTokens(n: number): string {
	if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
	return n.toString();
}

// Owns the wave-in animation. Mounts with every cell collapsed, then sweeps
// them in left-to-right once `inView` flips.
function HeatmapGrid({
	weeks,
	inView,
	onHover,
	onLeave,
}: {
	weeks: Day[][];
	inView: boolean;
	onHover: (event: React.MouseEvent, day: Day) => void;
	onLeave: () => void;
}) {
	const [wave, setWave] = useState(false);
	const [settled, setSettled] = useState(false);

	useEffect(() => {
		if (!inView) return;
		// Double rAF so the collapsed state paints before the transition starts.
		let raf2 = 0;
		const raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => setWave(true));
		});
		// Once the sweep finishes, drop the per-cell delays so hover feels instant.
		const waveTotalMs = weeks.length * WEEK_DELAY_MS + 6 * ROW_DELAY_MS + 400;
		const timer = window.setTimeout(() => setSettled(true), waveTotalMs);
		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
			window.clearTimeout(timer);
		};
	}, [inView, weeks.length]);

	return (
		<div className="flex gap-[3px]">
			{weeks.map((week, weekIndex) => (
				<div key={weekIndex} className="flex flex-col gap-[3px]">
					{week.map((day, dayIndex) => (
						<div
							key={day.date.getTime()}
							onMouseEnter={event => onHover(event, day)}
							onMouseMove={event => onHover(event, day)}
							onMouseLeave={onLeave}
							style={{
								transitionDelay: settled
									? '0ms'
									: `${weekIndex * WEEK_DELAY_MS + dayIndex * ROW_DELAY_MS}ms`,
							}}
							className={clsx(
								'h-3 w-3 rounded-[3px] ring-1 ring-inset ring-black/[0.04] transition-all duration-300 ease-out hover:scale-125 dark:ring-white/[0.04]',
								wave ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
								CELL_COLORS[day.level],
							)}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export function ClaudeActivity() {
	// Real usage, aggregated by scripts/generate-claude-usage.mjs. Until it
	// loads (or if it 404s), the modeled calendar renders on its own.
	const [realDays, setRealDays] = useState<Record<string, RealDay> | null>(null);

	useEffect(() => {
		let cancelled = false;
		fetch('/claude-usage.json')
			.then(response => (response.ok ? response.json() : null))
			.then(json => {
				if (!cancelled && json?.days) setRealDays(json.days as Record<string, RealDay>);
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);

	const {weeks, totalMessages, totalTokens, best, streak, modeledDays} = useMemo(
		() => buildCalendar(realDays),
		[realDays],
	);

	const [tip, setTip] = useState<{x: number; y: number; label: string} | null>(null);

	const cardRef = useRef<HTMLDivElement>(null);
	const inView = useInView(cardRef, {once: true, margin: '-64px'});

	const show = (event: React.MouseEvent, day: Day) => {
		let label: string;
		if (day.messages === 0) {
			label = `No activity · ${formatDate(day.date)}`;
		} else {
			const sources: string[] = [];
			if (day.codeTokens > 0) sources.push(`${formatTokens(day.codeTokens)} Code`);
			if (day.designTokens > 0) sources.push(`${formatTokens(day.designTokens)} Design`);
			if (day.chatTokens > 0) sources.push(`${formatTokens(day.chatTokens)} Chat`);
			const tokens = `${formatTokens(day.tokens)} tokens${sources.length ? ` (${sources.join(', ')})` : ''}`;
			label = `${day.messages} message${day.messages === 1 ? '' : 's'} · ${tokens} · ${formatDate(day.date)}`;
		}
		setTip({x: event.clientX, y: event.clientY, label});
	};

	// On narrow screens the grid overflows horizontally — start scrolled to the
	// most recent weeks, since those are the ones worth seeing first.
	const scrollRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollLeft = el.scrollWidth;
	}, [weeks]);

	// Month labels: show a month above the first week where it changes.
	const monthCols = useMemo(() => {
		const cols: Array<{index: number; label: string}> = [];
		let lastMonth = -1;
		weeks.forEach((week, index) => {
			const first = week[0]!.date;
			if (first.getMonth() !== lastMonth) {
				lastMonth = first.getMonth();
				cols.push({index, label: MONTHS[first.getMonth()]!});
			}
		});
		return cols;
	}, [weeks]);

	return (
		<div
			ref={cardRef}
			className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85"
		>
			<div className="flex items-baseline justify-between gap-3">
				<div>
					<p className="text-xs text-neutral-500 dark:text-neutral-400">Claude</p>
					<p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300">
						<span className="font-semibold text-neutral-900 dark:text-neutral-100">
							{totalMessages.toLocaleString()}
						</span>{' '}
						messages and{' '}
						<span className="font-semibold text-neutral-900 dark:text-neutral-100">
							{formatTokens(totalTokens)}
						</span>{' '}
						tokens with Claude in the last year.
					</p>
				</div>
				<span className="hidden shrink-0 rounded-full bg-[#D97757]/10 px-2.5 py-1 text-xs font-medium text-[#B14E2C] dark:bg-[#D97757]/15 dark:text-[#EC8A5D] sm:inline">
					{streak}-day streak
				</span>
			</div>

			<div
				ref={scrollRef}
				className="mt-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<div className="flex gap-2">
					{/* Weekday labels */}
					<div className="flex shrink-0 flex-col gap-[3px] pt-[18px]">
						{WEEKDAY_LABELS.map((label, index) => (
							<div
								key={index}
								className="flex h-3 items-center text-[9px] leading-none text-neutral-400 dark:text-neutral-600"
							>
								{label}
							</div>
						))}
					</div>

					{/* Month labels + grid */}
					<div className="min-w-0">
						<div className="relative h-[15px]">
							{monthCols.map(col => (
								<span
									key={col.index}
									className="absolute top-0 text-[9px] leading-none text-neutral-400 dark:text-neutral-600"
									style={{left: `${col.index * 15}px`}}
								>
									{col.label}
								</span>
							))}
						</div>

						<HeatmapGrid
							weeks={weeks}
							inView={inView}
							onHover={show}
							onLeave={() => setTip(null)}
						/>
					</div>
				</div>
			</div>

			{/* Legend */}
			<div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-600">
				<span>Less</span>
				{CELL_COLORS.map((color, index) => (
					<span key={index} className={clsx('h-3 w-3 rounded-[3px]', color)} />
				))}
				<span>More</span>
			</div>

			<p className="mt-3 text-[11px] leading-5 text-neutral-400 dark:text-neutral-500">
				Busiest day was {formatDate(best.date)} with {best.messages} messages.
				{modeledDays > 7 ? <> Earlier days are modeled.</> : null}
			</p>

			{tip ? (
				<div
					className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900"
					style={{left: tip.x, top: tip.y - 10}}
				>
					{tip.label}
				</div>
			) : null}
		</div>
	);
}
