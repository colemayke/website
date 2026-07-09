import clsx from 'clsx';
import {motion, useReducedMotion} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
	BlackjackEngine,
	STARTING_BANKROLL,
	handValue,
	type Card,
	type GameEvent,
	type HandOutcome,
	type PlayerAction,
} from '../../games/blackjack/engine';
import {cardShorthand, PlayingCard} from './playing-card';

const BANKROLL_KEY = 'blackjack-bankroll';
const CHIP_VALUES = [5, 25, 100, 500];
const MIN_BET = CHIP_VALUES[0]!;

const enter = {
	initial: {opacity: 0, y: 10, scale: 0.98},
	animate: {opacity: 1, y: 0, scale: 1},
	transition: {type: 'spring' as const, stiffness: 480, damping: 32, mass: 1},
};

function fmt(amount: number): string {
	return Number.isInteger(amount)
		? amount.toLocaleString()
		: amount.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1});
}

interface HandView {
	cards: Card[];
	bet: number;
	outcome: HandOutcome | null;
}

interface RoundView {
	upCard: Card | null;
	holeCard: Card | null;
	hasHole: boolean;
	dealerHits: Card[];
	hands: HandView[];
	activeHand: number;
	playing: boolean;
}

type ThreadItem =
	| {key: string; kind: 'dealer'; text: string}
	| {key: string; kind: 'player'; text: string}
	| {key: string; kind: 'dealer-hand'; round: number}
	| {key: string; kind: 'player-hand'; round: number};

interface TableState {
	thread: ThreadItem[];
	rounds: Record<number, RoundView>;
}

interface Step {
	delay: number;
	run: () => void;
}

function freshRound(): RoundView {
	return {
		upCard: null,
		holeCard: null,
		hasHole: false,
		dealerHits: [],
		hands: [],
		activeHand: 0,
		playing: false,
	};
}

function DealerAvatar({size = 'size-8 text-sm'}: {size?: string}) {
	return (
		<div
			aria-hidden="true"
			className={clsx(
				'flex shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white ring-1 ring-neutral-200 dark:bg-neutral-100 dark:text-neutral-900 dark:ring-neutral-800',
				size,
			)}
		>
			♠
		</div>
	);
}

function TypingDots() {
	return (
		<motion.div {...enter} className="flex items-end gap-2">
			<DealerAvatar />
			<div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-neutral-200 bg-gray-100 px-3.5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
				<span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s] dark:bg-neutral-500" />
				<span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s] dark:bg-neutral-500" />
				<span className="size-1.5 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500" />
			</div>
		</motion.div>
	);
}

function DealerBubble({text, isLast}: {text: string; isLast: boolean}) {
	return (
		<motion.div
			{...enter}
			className={clsx(
				'w-fit max-w-[88%] border border-neutral-200 bg-gray-100 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900',
				isLast ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl',
			)}
		>
			{text}
		</motion.div>
	);
}

function PlayerBubble({text}: {text: string}) {
	return (
		<motion.div {...enter} className="flex justify-end">
			<div className="w-fit max-w-[82%] rounded-2xl rounded-br-md bg-imsg px-3.5 py-2 text-sm text-white shadow-sm">
				{text}
			</div>
		</motion.div>
	);
}

function handBadge(hand: HandView): string {
	if (hand.cards.length === 0) {
		return '…';
	}

	const value = handValue(hand.cards);
	const total = value.soft && value.total !== 21 ? `Soft ${value.total}` : `${value.total}`;

	switch (hand.outcome) {
		case 'blackjack':
			return 'Blackjack · paid 3:2';
		case 'win':
			return `${total} · win +${fmt(hand.bet)}`;
		case 'push':
			return `${total} · push`;
		case 'lose':
			return `${total} · dealer wins`;
		case 'bust':
			return `${value.total} · bust`;
		default:
			return `${total} · bet ${fmt(hand.bet)}`;
	}
}

function DealerHandStrip({view}: {view: RoundView}) {
	const revealed = view.holeCard !== null;
	const cards = view.upCard ? [view.upCard, ...(view.holeCard ? [view.holeCard] : []), ...view.dealerHits] : [];
	const label = revealed
		? `${handValue(cards).total}`
		: view.upCard
			? `showing ${handValue([view.upCard]).total}`
			: '…';

	return (
		<div className="flex items-end gap-2">
			<DealerAvatar />
			<div className="rounded-2xl rounded-bl-md border border-neutral-200 bg-gray-100 p-2 dark:border-neutral-800 dark:bg-neutral-900">
				<div className="flex flex-wrap gap-1">
					{view.upCard ? <PlayingCard card={view.upCard} /> : null}
					{view.hasHole || view.holeCard ? (
						<PlayingCard
							card={view.holeCard ?? {rank: 'A', suit: 'spades'}}
							faceDown={view.holeCard === null}
						/>
					) : null}
					{view.dealerHits.map((card, index) => (
						<PlayingCard key={`hit-${index}-${card.rank}-${card.suit}`} card={card} />
					))}
				</div>
				<p className="mt-1.5 px-0.5 text-xs text-neutral-500 dark:text-neutral-400">
					Dealer · {label}
				</p>
			</div>
		</div>
	);
}

function PlayerHandsStrip({view}: {view: RoundView}) {
	return (
		<div className="flex flex-wrap items-end justify-end gap-2">
			{view.hands.map((hand, index) => {
				const active = view.playing && view.hands.length > 1 && index === view.activeHand;

				return (
					<div
						key={`hand-${index}`}
						className={clsx(
							'rounded-2xl rounded-br-md border p-2 transition-shadow',
							active
								? 'border-imsg/60 shadow-[0_0_0_1px] shadow-imsg/40'
								: 'border-neutral-200 dark:border-neutral-800',
							'bg-gray-100 dark:bg-neutral-900',
						)}
					>
						<div className="flex flex-wrap justify-end gap-1">
							{hand.cards.map((card, cardIndex) => (
								<PlayingCard key={`card-${cardIndex}-${card.rank}-${card.suit}`} card={card} />
							))}
						</div>
						<p className="mt-1.5 px-0.5 text-right text-xs text-neutral-500 dark:text-neutral-400">
							{view.hands.length > 1 ? `Hand ${index + 1} · ` : ''}
							{handBadge(hand)}
						</p>
					</div>
				);
			})}
		</div>
	);
}

/** Grey chip in the compose bar, iMessage suggestion style. */
function ActionChip({
	label,
	onClick,
	disabled = false,
	tone = 'accent',
}: {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	tone?: 'accent' | 'plain';
}) {
	return (
		<motion.button
			type="button"
			whileTap={{scale: disabled ? 1 : 0.94}}
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				'rounded-full bg-neutral-100 px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imsg disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-900',
				tone === 'accent'
					? 'text-imsg hover:bg-neutral-200 dark:hover:bg-neutral-800'
					: 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800',
			)}
		>
			{label}
		</motion.button>
	);
}

export function BlackjackTable() {
	const reduce = useReducedMotion();

	const engineRef = useRef<BlackjackEngine | null>(null);
	if (engineRef.current === null) {
		engineRef.current = new BlackjackEngine();
	}
	const engine = engineRef.current;

	const [table, setTable] = useState<TableState>({thread: [], rounds: {}});
	const [bankroll, setBankroll] = useState(STARTING_BANKROLL);
	const [loaded, setLoaded] = useState(false);
	const [inPlay, setInPlay] = useState(0);
	const [bet, setBet] = useState(0);
	const [busy, setBusy] = useState(false);

	const keyRef = useRef(0);
	const roundRef = useRef(0);
	const queueRef = useRef<Step[]>([]);
	const pumpingRef = useRef(false);
	const timerRef = useRef<number | null>(null);
	const startedRef = useRef(false);

	const available = bankroll - inPlay;

	// Load and persist the bankroll (survives reloads).
	useEffect(() => {
		try {
			const raw = localStorage.getItem(BANKROLL_KEY);
			const value = raw === null ? Number.NaN : Number(raw);
			if (Number.isFinite(value) && value >= 0) {
				setBankroll(value);
			}
		} catch {}
		setLoaded(true);
	}, []);

	useEffect(() => {
		if (!loaded) {
			return;
		}
		try {
			localStorage.setItem(BANKROLL_KEY, String(bankroll));
		} catch {}
	}, [bankroll, loaded]);

	const nextKey = () => `t${++keyRef.current}`;

	const scrollDown = () => {
		window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'smooth'});
	};

	const pump = useCallback(() => {
		const step = queueRef.current.shift();

		if (!step) {
			pumpingRef.current = false;
			timerRef.current = null;
			setBusy(false);
			return;
		}

		timerRef.current = window.setTimeout(
			() => {
				step.run();
				scrollDown();
				pump();
			},
			reduce ? 0 : step.delay,
		);
	}, [reduce]);

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
			}
		};
	}, []);

	const enqueue = useCallback(
		(steps: Step[]) => {
			queueRef.current.push(...steps);
			if (!pumpingRef.current) {
				pumpingRef.current = true;
				setBusy(true);
				pump();
			}
		},
		[pump],
	);

	const pushItem = (item: ThreadItem) => {
		setTable(prev => ({...prev, thread: [...prev.thread, item]}));
	};

	const updateRound = (round: number, mutate: (view: RoundView) => RoundView) => {
		setTable(prev => {
			const view = prev.rounds[round];
			if (!view) {
				return prev;
			}
			return {...prev, rounds: {...prev.rounds, [round]: mutate(view)}};
		});
	};

	const dealerSays = (text: string, delay = 650): Step => ({
		delay,
		run: () => pushItem({key: nextKey(), kind: 'dealer', text}),
	});

	const playerSays = (text: string): Step => ({
		delay: 0,
		run: () => pushItem({key: nextKey(), kind: 'player', text}),
	});

	// Money moves synchronously (not through the narration queue) so nothing is
	// lost if the user navigates away mid-round. Staked totals are mirrored in
	// refs for synchronous access across multiple engine calls per round.
	const stakedRef = useRef(0);
	const inPlayRef = useRef(0);

	const settleMoney = (events: GameEvent[]) => {
		for (const event of events) {
			if (event.type === 'stake') {
				stakedRef.current += event.amount;
				inPlayRef.current += event.amount;
				setInPlay(inPlayRef.current);
			}
			if (event.type === 'roundOver') {
				const staked = stakedRef.current;
				setBankroll(previous => previous - staked + event.returned);
				stakedRef.current = 0;
				inPlayRef.current = 0;
				setInPlay(0);
			}
		}
	};

	const stepsFor = (events: GameEvent[], round: number): Step[] => {
		const steps: Step[] = [];
		const handCount = () => engine.hands.length;

		for (const event of events) {
			switch (event.type) {
				case 'shuffle':
					steps.push(dealerSays('Cut card’s out — shuffling the shoe.', 500));
					break;

				case 'dealPlayer':
					steps.push({
						delay: 320,
						run: () =>
							updateRound(round, view => {
								const hands = view.hands.map((hand, i) =>
									i === event.hand ? {...hand, cards: [...hand.cards, event.card]} : hand,
								);
								return {...view, hands};
							}),
					});
					break;

				case 'dealDealerUp':
					steps.push({
						delay: 320,
						run: () => updateRound(round, view => ({...view, upCard: event.card})),
					});
					steps.push(dealerSays(`Dealer shows the ${cardShorthand(event.card)}.`, 500));
					break;

				case 'dealDealerHole':
					steps.push({
						delay: 320,
						run: () => updateRound(round, view => ({...view, hasHole: true})),
					});
					break;

				case 'insuranceOffered':
					steps.push(dealerSays('Insurance? Half your bet, pays 2 to 1.'));
					break;

				case 'peek':
					steps.push(
						dealerSays(
							event.hasBlackjack
								? 'Dealer checks the hole card…'
								: 'Dealer checks the hole card — no blackjack.',
						),
					);
					break;

				case 'insurancePaid':
					steps.push(dealerSays(`Insurance pays ${fmt(event.amount)}.`));
					break;

				case 'insuranceLost':
					steps.push(dealerSays('Insurance is off.', 450));
					break;

				case 'playerBlackjack':
					steps.push(dealerSays('Blackjack!'));
					break;

				case 'playerCard':
					steps.push({
						delay: 380,
						run: () =>
							updateRound(round, view => {
								const hands = view.hands.map((hand, i) =>
									i === event.hand ? {...hand, cards: [...hand.cards, event.card]} : hand,
								);
								return {...view, hands};
							}),
					});
					break;

				case 'playerBust':
					steps.push(dealerSays(`That’s ${event.total} — bust.`, 550));
					break;

				case 'stand':
					if (event.total === 21) {
						steps.push(dealerSays('Twenty-one.', 500));
					}
					break;

				case 'double':
					steps.push({
						delay: 0,
						run: () =>
							updateRound(round, view => {
								const hands = view.hands.map((hand, i) =>
									i === event.hand ? {...hand, bet: event.bet} : hand,
								);
								return {...view, hands};
							}),
					});
					steps.push(dealerSays(`Bet’s ${fmt(event.bet)} now. One card.`, 450));
					break;

				case 'split': {
					steps.push({
						delay: 320,
						run: () =>
							updateRound(round, view => {
								const source = view.hands[event.hand];
								if (!source || source.cards.length < 2) {
									return view;
								}
								const moved = source.cards[source.cards.length - 1]!;
								const hands = [...view.hands];
								hands[event.hand] = {...source, cards: source.cards.slice(0, -1)};
								hands.splice(event.hand + 1, 0, {cards: [moved], bet: source.bet, outcome: null});
								return {...view, hands};
							}),
					});
					steps.push(dealerSays(`Split — playing ${event.hands} hands.`, 450));
					break;
				}

				case 'dealerReveal':
					steps.push({
						delay: 550,
						run: () => updateRound(round, view => ({...view, holeCard: event.card, hasHole: true})),
					});
					steps.push(
						dealerSays(`Dealer turns over the ${cardShorthand(event.card)} — ${event.total}.`),
					);
					break;

				case 'dealerHit':
					steps.push({
						delay: 700,
						run: () =>
							updateRound(round, view => ({...view, dealerHits: [...view.dealerHits, event.card]})),
					});
					steps.push(dealerSays(`Dealer draws the ${cardShorthand(event.card)}.`, 450));
					break;

				case 'dealerStand':
					steps.push(dealerSays(`Dealer stands on ${event.soft ? 'soft ' : ''}${event.total}.`));
					break;

				case 'dealerBust':
					steps.push(dealerSays(`Dealer busts with ${event.total}.`));
					break;

				case 'handResult': {
					const prefix = handCount() > 1 ? `Hand ${event.hand + 1}: ` : '';
					const profit = event.returns - event.bet;
					const text =
						event.outcome === 'blackjack'
							? `${prefix}Paid 3 to 2 — you win ${fmt(profit)}.`
							: event.outcome === 'win'
								? `${prefix}You win ${fmt(profit)}.`
								: event.outcome === 'push'
									? `${prefix}Push — your ${fmt(event.bet)} comes back.`
									: event.outcome === 'bust'
										? ''
										: `${prefix}Dealer takes it.`;

					steps.push({
						delay: 550,
						run: () =>
							updateRound(round, view => {
								const hands = view.hands.map((hand, i) =>
									i === event.hand ? {...hand, outcome: event.outcome} : hand,
								);
								return {...view, hands};
							}),
					});
					if (text) {
						steps.push(dealerSays(text, 450));
					}
					break;
				}

				case 'roundOver':
					steps.push({
						delay: 0,
						run: () => updateRound(round, view => ({...view, playing: false})),
					});
					break;

				case 'stake':
				case 'insuranceTaken':
				case 'insuranceDeclined':
					break;
			}
		}

		// Keep the active-hand highlight in sync once narration settles.
		const activeHand = engine.activeHand;
		const playing = engine.phase === 'player';
		steps.push({
			delay: 0,
			run: () => updateRound(round, view => ({...view, activeHand, playing})),
		});

		return steps;
	};

	// Greeting from the dealer on first visit.
	useEffect(() => {
		if (startedRef.current) {
			return;
		}
		startedRef.current = true;

		enqueue([
			dealerSays('Welcome to the table.', 500),
			dealerSays('Six decks. Blackjack pays 3 to 2, dealer stands on 17.', 900),
			dealerSays('Place a bet when you’re ready.', 900),
		]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onDeal = () => {
		if (busy || bet < MIN_BET || bet > available || (engine.phase !== 'betting' && engine.phase !== 'over')) {
			return;
		}

		roundRef.current += 1;
		const round = roundRef.current;
		const events = engine.startRound(bet);
		settleMoney(events);

		const openTable: Step = {
			delay: 250,
			run: () => {
				setTable(prev => ({
					thread: [
						...prev.thread,
						{key: nextKey(), kind: 'dealer-hand', round},
						{key: nextKey(), kind: 'player-hand', round},
					],
					rounds: {
						...prev.rounds,
						[round]: {
							...freshRound(),
							hands: [{cards: [], bet, outcome: null}],
							playing: true,
						},
					},
				}));
			},
		};

		enqueue([playerSays(`Bet ${fmt(bet)}`), openTable, ...stepsFor(events, round)]);
	};

	const onAction = (action: PlayerAction) => {
		if (busy || engine.phase !== 'player') {
			return;
		}

		const labels: Record<PlayerAction, string> = {
			hit: 'Hit',
			stand: 'Stand',
			double: 'Double down',
			split: 'Split',
		};

		const events = engine.act(action);
		settleMoney(events);
		enqueue([playerSays(labels[action]), ...stepsFor(events, roundRef.current)]);
	};

	const onInsurance = (take: boolean) => {
		if (busy || engine.phase !== 'insurance') {
			return;
		}

		const events = engine.resolveInsurance(take);
		settleMoney(events);
		enqueue([
			playerSays(take ? `Insurance — ${fmt(engine.insuranceBet)}` : 'No insurance'),
			...stepsFor(events, roundRef.current),
		]);
	};

	const onReset = () => {
		if (busy || (engine.phase !== 'betting' && engine.phase !== 'over')) {
			return;
		}
		setBankroll(STARTING_BANKROLL);
		setBet(0);
		enqueue([dealerSays(`Fresh stack — ${fmt(STARTING_BANKROLL)} chips.`, 400)]);
	};

	const betting = !busy && (engine.phase === 'betting' || engine.phase === 'over');
	const acting = !busy && engine.phase === 'player';
	const insuring = !busy && engine.phase === 'insurance';
	const broke = betting && available < MIN_BET;

	const activeBet = engine.hands[engine.activeHand]?.bet ?? 0;
	const actions = acting ? engine.availableActions() : [];
	const canAfford = (action: PlayerAction) =>
		action === 'double' || action === 'split' ? available >= activeBet : true;

	// Group consecutive dealer texts so the avatar shows once per burst.
	const grouped: Array<
		| {key: string; kind: 'dealer-group'; texts: Array<{key: string; text: string}>}
		| Exclude<ThreadItem, {kind: 'dealer'}>
	> = [];
	for (const item of table.thread) {
		if (item.kind === 'dealer') {
			const last = grouped[grouped.length - 1];
			if (last && last.kind === 'dealer-group') {
				last.texts.push({key: item.key, text: item.text});
			} else {
				grouped.push({key: item.key, kind: 'dealer-group', texts: [{key: item.key, text: item.text}]});
			}
		} else {
			grouped.push(item);
		}
	}

	return (
		<div>
			{/* Contact header */}
			<div className="mb-2 flex flex-col items-center gap-1.5 text-center">
				<DealerAvatar size="size-14 text-2xl" />
				<p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Dealer</p>
				<p className="text-xs text-neutral-500 dark:text-neutral-400">
					Blackjack · 6-deck shoe · pays 3:2 · dealer stands on 17
				</p>
			</div>

			{/* Bankroll row */}
			<div className="mb-6 flex items-center justify-center gap-2 text-xs">
				<span className="rounded-full border border-neutral-200 px-3 py-1 font-medium text-neutral-700 dark:border-neutral-800 dark:text-neutral-200">
					Bankroll {fmt(available)}
				</span>
				{inPlay > 0 ? (
					<span className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
						In play {fmt(inPlay)}
					</span>
				) : null}
				<button
					type="button"
					onClick={onReset}
					disabled={busy || !betting}
					className="rounded-full px-2 py-1 text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imsg disabled:opacity-40 dark:text-neutral-500 dark:hover:text-neutral-200"
					title="Reset bankroll to 1,000"
				>
					Reset
				</button>
			</div>

			{/* Thread */}
			<div role="log" aria-live="polite" className="space-y-3">
				{grouped.map(item => {
					if (item.kind === 'dealer-group') {
						return (
							<div key={item.key} className="flex items-end gap-2">
								<DealerAvatar />
								<div className="flex flex-col items-start space-y-1">
									{item.texts.map((entry, index) => (
										<DealerBubble
											key={entry.key}
											text={entry.text}
											isLast={index === item.texts.length - 1}
										/>
									))}
								</div>
							</div>
						);
					}

					if (item.kind === 'player') {
						return <PlayerBubble key={item.key} text={item.text} />;
					}

					const view = table.rounds[item.round];
					if (!view) {
						return null;
					}

					if (item.kind === 'dealer-hand') {
						return (
							<motion.div {...enter} key={item.key}>
								<DealerHandStrip view={view} />
							</motion.div>
						);
					}

					return (
						<motion.div {...enter} key={item.key}>
							<PlayerHandsStrip view={view} />
						</motion.div>
					);
				})}

				{busy ? <TypingDots /> : null}
			</div>

			{/* Compose bar */}
			<div className="sticky bottom-3 z-10 mt-5">
				<div className="flex min-h-[3.25rem] w-full flex-wrap items-center gap-2 rounded-[1.75rem] border border-neutral-300 bg-white/90 px-3 py-2 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90">
					{betting && !broke ? (
						<>
							<div className="flex items-center gap-1.5" role="group" aria-label="Add chips to your bet">
								{CHIP_VALUES.map(value => (
									<motion.button
										key={value}
										type="button"
										whileTap={{scale: 0.9}}
										onClick={() => setBet(previous => Math.min(previous + value, available))}
										disabled={bet + value > available}
										aria-label={`Add ${value} chips`}
										className="flex size-9 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imsg disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-600 dark:text-neutral-200 dark:hover:border-neutral-400"
									>
										{value}
									</motion.button>
								))}
							</div>

							<span className="min-w-0 flex-1 truncate text-sm text-neutral-500 dark:text-neutral-400">
								{bet > 0 ? (
									<>
										Bet {fmt(bet)}
										<button
											type="button"
											onClick={() => setBet(0)}
											aria-label="Clear bet"
											className="ml-1.5 rounded-full px-1 text-neutral-400 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imsg dark:hover:text-neutral-200"
										>
											×
										</button>
									</>
								) : (
									'Tap chips to bet…'
								)}
							</span>

							<motion.button
								type="button"
								whileTap={{scale: bet >= MIN_BET ? 0.9 : 1}}
								onClick={onDeal}
								disabled={bet < MIN_BET}
								aria-label={`Deal with a bet of ${fmt(bet)}`}
								className={clsx(
									'flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imsg',
									bet >= MIN_BET
										? 'bg-imsg text-white'
										: 'cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
								)}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M12 19V5M5 12l7-7 7 7" />
								</svg>
							</motion.button>
						</>
					) : null}

					{betting && broke ? (
						<>
							<span className="min-w-0 flex-1 text-sm text-neutral-500 dark:text-neutral-400">
								You’re out of chips.
							</span>
							<ActionChip label="New stack" onClick={onReset} />
						</>
					) : null}

					{acting ? (
						<div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Blackjack actions">
							{actions.includes('hit') ? <ActionChip label="Hit" onClick={() => onAction('hit')} /> : null}
							{actions.includes('stand') ? (
								<ActionChip label="Stand" onClick={() => onAction('stand')} />
							) : null}
							{actions.includes('double') ? (
								<ActionChip
									label={`Double ${fmt(activeBet)}`}
									onClick={() => onAction('double')}
									disabled={!canAfford('double')}
								/>
							) : null}
							{actions.includes('split') ? (
								<ActionChip
									label="Split"
									onClick={() => onAction('split')}
									disabled={!canAfford('split')}
								/>
							) : null}
						</div>
					) : null}

					{insuring ? (
						<div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Insurance">
							<ActionChip
								label={`Insurance ${fmt((engine.hands[0]?.bet ?? 0) / 2)}`}
								onClick={() => onInsurance(true)}
								disabled={available < (engine.hands[0]?.bet ?? 0) / 2}
							/>
							<ActionChip label="No thanks" onClick={() => onInsurance(false)} tone="plain" />
						</div>
					) : null}

					{busy ? (
						<span className="text-sm text-neutral-400 dark:text-neutral-500">Dealer’s moving…</span>
					) : null}
				</div>
			</div>
		</div>
	);
}
