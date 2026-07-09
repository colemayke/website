/**
 * Pure blackjack engine — no React or DOM concerns.
 *
 * House rules: 6-deck shoe, cut card at 80% penetration (reshuffle between
 * rounds once fewer than a fifth of the shoe remains; if a pathological round
 * somehow drains the shoe entirely, a fresh shoe is shuffled in mid-round),
 * dealer stands on all 17s (S17),
 * dealer peeks on an Ace or 10-value up-card, naturals pay 3:2, double on any
 * first two cards, up to 3 splits (4 hands), split Aces get one card each,
 * insurance costs half the bet and pays 2:1.
 */

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank =
	| 'A'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| 'J'
	| 'Q'
	| 'K';

export interface Card {
	rank: Rank;
	suit: Suit;
}

/** Returns a float in [0, 1). Injectable so tests can rig the shuffle. */
export type Rng = () => number;

export const DECK_COUNT = 6;
/** Reshuffle between rounds once fewer than 1/5 of the shoe remains. */
export const CUT_CARD_REMAINING = Math.floor((DECK_COUNT * 52) / 5);
export const STARTING_BANKROLL = 1000;

const RANKS: readonly Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS: readonly Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

export function cardValue(rank: Rank): number {
	if (rank === 'A') {
		return 11;
	}
	if (rank === 'K' || rank === 'Q' || rank === 'J') {
		return 10;
	}
	return Number(rank);
}

export interface HandValue {
	total: number;
	/** True while an Ace is still counted as 11. */
	soft: boolean;
}

export function handValue(cards: readonly Card[]): HandValue {
	let total = 0;
	let elevens = 0;

	for (const card of cards) {
		total += cardValue(card.rank);
		if (card.rank === 'A') {
			elevens += 1;
		}
	}

	while (total > 21 && elevens > 0) {
		total -= 10;
		elevens -= 1;
	}

	return {total, soft: elevens > 0};
}

/** In-place Fisher–Yates shuffle. */
export function shuffle<T>(items: T[], rng: Rng): T[] {
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const swap = items[i]!;
		items[i] = items[j]!;
		items[j] = swap;
	}

	return items;
}

export function createShoe(decks: number = DECK_COUNT, rng: Rng = Math.random): Card[] {
	const cards: Card[] = [];

	for (let deck = 0; deck < decks; deck++) {
		for (const suit of SUITS) {
			for (const rank of RANKS) {
				cards.push({rank, suit});
			}
		}
	}

	return shuffle(cards, rng);
}

export type HandOutcome = 'blackjack' | 'win' | 'push' | 'lose' | 'bust';

export interface PlayerHand {
	cards: Card[];
	bet: number;
	doubled: boolean;
	fromSplit: boolean;
	splitAces: boolean;
	done: boolean;
	outcome: HandOutcome | null;
}

export type Phase = 'betting' | 'insurance' | 'player' | 'over';
export type PlayerAction = 'hit' | 'stand' | 'double' | 'split';

export type GameEvent =
	| {type: 'shuffle'; cardsInShoe: number}
	| {type: 'stake'; amount: number; reason: 'bet' | 'double' | 'split' | 'insurance'}
	| {type: 'dealPlayer'; hand: number; card: Card}
	| {type: 'dealDealerUp'; card: Card}
	| {type: 'dealDealerHole'}
	| {type: 'insuranceOffered'}
	| {type: 'insuranceTaken'; amount: number}
	| {type: 'insuranceDeclined'}
	| {type: 'peek'; hasBlackjack: boolean}
	| {type: 'insurancePaid'; amount: number}
	| {type: 'insuranceLost'}
	| {type: 'playerBlackjack'}
	| {type: 'playerCard'; hand: number; card: Card; total: number}
	| {type: 'playerBust'; hand: number; total: number}
	| {type: 'stand'; hand: number; total: number}
	| {type: 'double'; hand: number; bet: number}
	| {type: 'split'; hand: number; hands: number}
	| {type: 'dealerReveal'; card: Card; total: number}
	| {type: 'dealerHit'; card: Card; total: number}
	| {type: 'dealerStand'; total: number; soft: boolean}
	| {type: 'dealerBust'; total: number}
	| {type: 'handResult'; hand: number; outcome: HandOutcome; bet: number; returns: number}
	| {type: 'roundOver'; net: number; returned: number};

export interface EngineOptions {
	rng?: Rng;
	decks?: number;
	/** Pre-ordered shoe (drawn from index 0); skips the initial shuffle. */
	shoe?: Card[];
	cutCardRemaining?: number;
}

export class BlackjackEngine {
	readonly hands: PlayerHand[] = [];
	readonly dealer: Card[] = [];
	phase: Phase = 'betting';
	activeHand = 0;
	insuranceBet = 0;
	dealerRevealed = false;

	private readonly rng: Rng;
	private readonly decks: number;
	private readonly cutCardRemaining: number;
	private shoe: Card[];
	private drawIndex = 0;
	private splitCount = 0;
	private baseBet = 0;
	private roundStaked = 0;
	private roundReturned = 0;

	constructor(options: EngineOptions = {}) {
		this.rng = options.rng ?? Math.random;
		this.decks = options.decks ?? DECK_COUNT;
		this.cutCardRemaining = options.cutCardRemaining ?? CUT_CARD_REMAINING;
		this.shoe = options.shoe ?? createShoe(this.decks, this.rng);
	}

	get cardsRemaining(): number {
		return this.shoe.length - this.drawIndex;
	}

	startRound(bet: number): GameEvent[] {
		if (this.phase !== 'betting' && this.phase !== 'over') {
			throw new Error('A round is already in progress');
		}
		if (!Number.isFinite(bet) || bet <= 0) {
			throw new Error('Bet must be a positive amount');
		}

		const events: GameEvent[] = [];

		if (this.cardsRemaining < this.cutCardRemaining) {
			this.shoe = createShoe(this.decks, this.rng);
			this.drawIndex = 0;
			events.push({type: 'shuffle', cardsInShoe: this.shoe.length});
		}

		this.hands.length = 0;
		this.dealer.length = 0;
		this.activeHand = 0;
		this.insuranceBet = 0;
		this.splitCount = 0;
		this.baseBet = bet;
		this.roundStaked = 0;
		this.roundReturned = 0;
		this.dealerRevealed = false;

		this.stake(bet, 'bet', events);

		const hand: PlayerHand = {
			cards: [],
			bet,
			doubled: false,
			fromSplit: false,
			splitAces: false,
			done: false,
			outcome: null,
		};
		this.hands.push(hand);

		hand.cards.push(this.draw(events));
		events.push({type: 'dealPlayer', hand: 0, card: hand.cards[0]!});
		this.dealer.push(this.draw(events));
		events.push({type: 'dealDealerUp', card: this.dealer[0]!});
		hand.cards.push(this.draw(events));
		events.push({type: 'dealPlayer', hand: 0, card: hand.cards[1]!});
		this.dealer.push(this.draw(events));
		events.push({type: 'dealDealerHole'});

		const upCard = this.dealer[0]!;

		if (upCard.rank === 'A') {
			this.phase = 'insurance';
			events.push({type: 'insuranceOffered'});
			return events;
		}

		if (cardValue(upCard.rank) === 10) {
			return this.peekAndContinue(events);
		}

		return this.afterNoDealerBlackjack(events);
	}

	resolveInsurance(take: boolean): GameEvent[] {
		if (this.phase !== 'insurance') {
			throw new Error('Insurance is not being offered');
		}

		const events: GameEvent[] = [];

		if (take) {
			this.insuranceBet = this.baseBet / 2;
			this.stake(this.insuranceBet, 'insurance', events);
			events.push({type: 'insuranceTaken', amount: this.insuranceBet});
		} else {
			events.push({type: 'insuranceDeclined'});
		}

		return this.peekAndContinue(events);
	}

	availableActions(): PlayerAction[] {
		if (this.phase !== 'player') {
			return [];
		}

		const hand = this.hands[this.activeHand];
		if (!hand || hand.done) {
			return [];
		}

		const actions: PlayerAction[] = ['hit', 'stand'];

		if (hand.cards.length === 2 && !hand.splitAces) {
			actions.push('double');
			if (this.canSplit(hand)) {
				actions.push('split');
			}
		}

		return actions;
	}

	act(action: PlayerAction): GameEvent[] {
		if (!this.availableActions().includes(action)) {
			throw new Error(`Cannot ${action} right now`);
		}

		const events: GameEvent[] = [];
		const index = this.activeHand;
		const hand = this.hands[index]!;

		switch (action) {
			case 'hit': {
				this.dealTo(hand, index, events);
				this.settleDrawnHand(hand, index, events, false);
				break;
			}

			case 'stand': {
				hand.done = true;
				events.push({type: 'stand', hand: index, total: handValue(hand.cards).total});
				this.advance(events);
				break;
			}

			case 'double': {
				this.stake(hand.bet, 'double', events);
				hand.bet *= 2;
				hand.doubled = true;
				events.push({type: 'double', hand: index, bet: hand.bet});
				this.dealTo(hand, index, events);
				this.settleDrawnHand(hand, index, events, true);
				break;
			}

			case 'split': {
				const second = hand.cards.pop()!;
				const isAces = hand.cards[0]!.rank === 'A' && second.rank === 'A';

				hand.fromSplit = true;
				hand.splitAces = isAces;

				const newHand: PlayerHand = {
					cards: [second],
					bet: hand.bet,
					doubled: false,
					fromSplit: true,
					splitAces: isAces,
					done: false,
					outcome: null,
				};

				this.stake(hand.bet, 'split', events);
				this.hands.splice(index + 1, 0, newHand);
				this.splitCount += 1;
				events.push({type: 'split', hand: index, hands: this.hands.length});

				this.dealTo(hand, index, events);
				this.afterSplitDraw(hand, events);
				break;
			}
		}

		return events;
	}

	isNatural(hand: PlayerHand): boolean {
		return !hand.fromSplit && hand.cards.length === 2 && handValue(hand.cards).total === 21;
	}

	private draw(events: GameEvent[]): Card {
		// The cut card makes this unreachable in normal play, but a round of
		// maximum splits and tiny cards could in theory drain the shoe. Casinos
		// shuffle in a fresh shoe and keep dealing; so do we.
		if (this.drawIndex >= this.shoe.length) {
			this.shoe = createShoe(this.decks, this.rng);
			this.drawIndex = 0;
			events.push({type: 'shuffle', cardsInShoe: this.shoe.length});
		}

		const card = this.shoe[this.drawIndex]!;
		this.drawIndex += 1;
		return card;
	}

	private stake(amount: number, reason: 'bet' | 'double' | 'split' | 'insurance', events: GameEvent[]): void {
		this.roundStaked += amount;
		events.push({type: 'stake', amount, reason});
	}

	private canSplit(hand: PlayerHand): boolean {
		if (hand.cards.length !== 2 || hand.splitAces || this.splitCount >= 3) {
			return false;
		}
		const [first, second] = hand.cards;
		return (
			first !== undefined && second !== undefined && cardValue(first.rank) === cardValue(second.rank)
		);
	}

	private dealTo(hand: PlayerHand, index: number, events: GameEvent[]): void {
		const card = this.draw(events);
		hand.cards.push(card);
		events.push({type: 'playerCard', hand: index, card, total: handValue(hand.cards).total});
	}

	/** Shared hit/double completion: bust ends the hand, 21 auto-stands. */
	private settleDrawnHand(hand: PlayerHand, index: number, events: GameEvent[], forceDone: boolean): void {
		const {total} = handValue(hand.cards);

		if (total > 21) {
			hand.done = true;
			hand.outcome = 'bust';
			events.push({type: 'playerBust', hand: index, total});
			this.advance(events);
			return;
		}

		if (forceDone || total === 21) {
			hand.done = true;
			events.push({type: 'stand', hand: index, total});
			this.advance(events);
		}
	}

	private afterSplitDraw(hand: PlayerHand, events: GameEvent[]): void {
		const index = this.activeHand;
		const {total} = handValue(hand.cards);

		// Split Aces receive exactly one card; a two-card 21 auto-stands (it is
		// not a natural).
		if (hand.splitAces || total === 21) {
			hand.done = true;
			events.push({type: 'stand', hand: index, total});
			this.advance(events);
		}
	}

	private advance(events: GameEvent[]): void {
		const next = this.hands.findIndex(hand => !hand.done);

		if (next === -1) {
			this.dealerPlay(events);
			return;
		}

		this.activeHand = next;
		const hand = this.hands[next]!;

		// A freshly split hand is waiting on its second card.
		if (hand.cards.length === 1) {
			this.dealTo(hand, next, events);
			this.afterSplitDraw(hand, events);
		}
	}

	private peekAndContinue(events: GameEvent[]): GameEvent[] {
		const dealerNatural = handValue(this.dealer).total === 21;
		events.push({type: 'peek', hasBlackjack: dealerNatural});

		if (this.insuranceBet > 0) {
			if (dealerNatural) {
				const returned = this.insuranceBet * 3;
				this.roundReturned += returned;
				events.push({type: 'insurancePaid', amount: returned});
			} else {
				events.push({type: 'insuranceLost'});
			}
		}

		if (dealerNatural) {
			this.revealDealer(events);
			for (const hand of this.hands) {
				hand.done = true;
				hand.outcome = this.isNatural(hand) ? 'push' : 'lose';
			}
			return this.settle(events);
		}

		return this.afterNoDealerBlackjack(events);
	}

	private afterNoDealerBlackjack(events: GameEvent[]): GameEvent[] {
		const hand = this.hands[0]!;

		if (this.isNatural(hand)) {
			events.push({type: 'playerBlackjack'});
			hand.done = true;
			hand.outcome = 'blackjack';
			return this.settle(events);
		}

		this.phase = 'player';
		return events;
	}

	private revealDealer(events: GameEvent[]): void {
		this.dealerRevealed = true;
		events.push({type: 'dealerReveal', card: this.dealer[1]!, total: handValue(this.dealer).total});
	}

	private dealerPlay(events: GameEvent[]): GameEvent[] {
		this.revealDealer(events);

		const anyLive = this.hands.some(hand => hand.outcome !== 'bust');

		if (anyLive) {
			// S17: the dealer stands on every 17, soft included.
			let value = handValue(this.dealer);
			while (value.total < 17) {
				const card = this.draw(events);
				this.dealer.push(card);
				value = handValue(this.dealer);
				events.push({type: 'dealerHit', card, total: value.total});
			}

			if (value.total > 21) {
				events.push({type: 'dealerBust', total: value.total});
			} else {
				events.push({type: 'dealerStand', total: value.total, soft: value.soft});
			}
		}

		const dealerTotal = handValue(this.dealer).total;

		for (const hand of this.hands) {
			if (hand.outcome) {
				continue;
			}
			const total = handValue(hand.cards).total;
			hand.outcome =
				dealerTotal > 21 || total > dealerTotal ? 'win' : total === dealerTotal ? 'push' : 'lose';
		}

		return this.settle(events);
	}

	private settle(events: GameEvent[]): GameEvent[] {
		for (const [index, hand] of this.hands.entries()) {
			const outcome = hand.outcome ?? 'lose';
			const returns =
				outcome === 'blackjack'
					? hand.bet * 2.5
					: outcome === 'win'
						? hand.bet * 2
						: outcome === 'push'
							? hand.bet
							: 0;

			this.roundReturned += returns;
			events.push({type: 'handResult', hand: index, outcome, bet: hand.bet, returns});
		}

		this.phase = 'over';
		events.push({
			type: 'roundOver',
			net: this.roundReturned - this.roundStaked,
			returned: this.roundReturned,
		});

		return events;
	}
}
