import clsx from 'clsx';
import {motion, useReducedMotion} from 'framer-motion';
import {type ReactNode, useEffect, useRef, useState} from 'react';
import profilePhoto from '../../public/profile-avatar.jpg';

export type ConversationTurn =
	| {kind: 'prompt'; key: string; text: string}
	| {kind: 'reply'; key: string; messages: Array<{key: string; content: ReactNode}>}
	| {kind: 'block'; key: string; content: ReactNode};

const enter = {
	initial: {opacity: 0, y: 10, scale: 0.98},
	animate: {opacity: 1, y: 0, scale: 1},
	transition: {type: 'spring' as const, stiffness: 480, damping: 32, mass: 1},
};

const replyGroup = {
	initial: {},
	animate: {transition: {staggerChildren: 0.5, delayChildren: 0.05}},
};

const replyBubble = {
	initial: {opacity: 0, y: 8, scale: 0.98},
	animate: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {type: 'spring' as const, stiffness: 480, damping: 32},
	},
};

const TYPE_MS = 26;
const SEND_PAUSE_MS = 420;
const DOTS_MS = 1350;
const BLOCK_MS = 460;

function PromptBubble({text}: {text: string}) {
	return (
		<motion.div {...enter} className="flex justify-end">
			<div className="w-fit max-w-[82%] rounded-2xl rounded-br-md bg-[#0a7cff] px-3.5 py-2 text-sm text-white shadow-sm">
				{text}
			</div>
		</motion.div>
	);
}

function ReplyBubbles({messages}: {messages: Array<{key: string; content: ReactNode}>}) {
	return (
		<div className="flex items-end gap-2">
			<img
				src={profilePhoto.src}
				alt="Cole Mayke profile photo"
				className="size-8 shrink-0 rounded-full object-cover object-center ring-1 ring-neutral-200 dark:ring-neutral-800"
			/>
			<motion.div
				variants={replyGroup}
				initial="initial"
				animate="animate"
				className="flex flex-col items-start space-y-1"
			>
				{messages.map((message, index) => (
					<motion.div
						key={message.key}
						variants={replyBubble}
						className={clsx(
							'w-fit max-w-[88%] border border-neutral-200 bg-gray-100 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900',
							index === messages.length - 1 ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl',
						)}
					>
						{message.content}
					</motion.div>
				))}
			</motion.div>
		</div>
	);
}

function TypingDots() {
	return (
		<motion.div {...enter} className="flex items-end gap-2">
			<img
				src={profilePhoto.src}
				alt="Cole Mayke profile photo"
				className="size-8 shrink-0 rounded-full object-cover object-center ring-1 ring-neutral-200 dark:ring-neutral-800"
			/>
			<div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-neutral-200 bg-gray-100 px-3.5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
				<span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s] dark:bg-neutral-500" />
				<span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s] dark:bg-neutral-500" />
				<span className="size-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500" />
			</div>
		</motion.div>
	);
}

export function Conversation({turns}: {turns: ConversationTurn[]}) {
	const reduce = useReducedMotion();
	const total = turns.length;
	const [completed, setCompleted] = useState(0);
	const [phase, setPhase] = useState<'idle' | 'typing' | 'dots'>('idle');
	const [typed, setTyped] = useState('');

	const playingRef = useRef(false);
	const completedRef = useRef(0);
	const mountedRef = useRef(true);
	const startedRef = useRef(false);

	const sleep = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

	const scrollDown = () => {
		window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'});
	};

	const commit = (next: number) => {
		setCompleted(next);
		completedRef.current = next;
	};

	const play = async () => {
		if (playingRef.current) {
			return;
		}
		playingRef.current = true;

		let i = completedRef.current;
		while (i < total && mountedRef.current) {
			const turn = turns[i]!;

			if (turn.kind === 'prompt') {
				setPhase('typing');
				for (let c = 1; c <= turn.text.length && mountedRef.current; c++) {
					setTyped(turn.text.slice(0, c));
					await sleep(TYPE_MS);
				}
				await sleep(SEND_PAUSE_MS);
				if (!mountedRef.current) break;
				setTyped('');
				setPhase('idle');
				i += 1;
				commit(i);
				scrollDown();
				continue;
			}

			setPhase('dots');
			scrollDown();
			await sleep(turn.kind === 'block' ? BLOCK_MS : DOTS_MS);
			if (!mountedRef.current) break;
			setPhase('idle');
			i += 1;
			commit(i);
			scrollDown();

			// Pause after each reply/block; a prompt auto-continues into its answer above.
			break;
		}

		playingRef.current = false;
	};

	useEffect(() => {
		if (reduce) {
			commit(total);
			return;
		}

		mountedRef.current = true;

		if (!startedRef.current) {
			startedRef.current = true;
			void play();
		} else if (!playingRef.current && completedRef.current < total) {
			void play();
		}

		return () => {
			mountedRef.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduce]);

	useEffect(() => {
		if (reduce) {
			return;
		}

		let lastAdvance = 0;

		const tryAdvance = () => {
			const now = performance.now();
			if (now - lastAdvance < 320) {
				return;
			}
			lastAdvance = now;
			if (!playingRef.current && completedRef.current < total) {
				void play();
			}
		};

		// Advance only on a deliberate keypress (or a tap on the input bar);
		// scrolling is left entirely for reading.
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ' || event.key === 'Enter') {
				event.preventDefault();
				tryAdvance();
			}
		};

		window.addEventListener('keydown', onKey);

		return () => {
			window.removeEventListener('keydown', onKey);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reduce, total]);

	const hasMore = completed < total;
	const idleHint = hasMore ? 'Tap or press ↓ to continue…' : 'iMessage';

	const onBarClick = () => {
		if (!playingRef.current && completedRef.current < total) {
			void play();
		}
	};

	return (
		<div>
			<div className="space-y-3">
				{turns.slice(0, completed).map(turn => {
					if (turn.kind === 'prompt') {
						return <PromptBubble key={turn.key} text={turn.text} />;
					}
					if (turn.kind === 'block') {
						return (
							<motion.div {...enter} key={turn.key}>
								{turn.content}
							</motion.div>
						);
					}
					return <ReplyBubbles key={turn.key} messages={turn.messages} />;
				})}

				{phase === 'dots' ? <TypingDots /> : null}
			</div>

			<div className="sticky bottom-3 z-10 mt-5">
				<button
					type="button"
					onClick={onBarClick}
					aria-label="Continue the conversation"
					className="flex w-full items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-4 py-2 text-left shadow-sm backdrop-blur transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:border-neutral-600"
				>
					<span className="min-w-0 flex-1 truncate text-sm">
						{phase === 'typing' ? (
							<span className="text-neutral-900 dark:text-neutral-100">
								{typed}
								<span className="ml-px inline-block animate-pulse">|</span>
							</span>
						) : (
							<span className="text-neutral-400 dark:text-neutral-500">{idleHint}</span>
						)}
					</span>
					<span
						className={clsx(
							'flex size-7 shrink-0 items-center justify-center rounded-full transition-colors',
							phase === 'typing' && typed
								? 'bg-[#0a7cff] text-white'
								: 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
						)}
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<path d="M12 19V5M5 12l7-7 7 7" />
						</svg>
					</span>
				</button>
			</div>
		</div>
	);
}
