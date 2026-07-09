import assert from 'node:assert/strict';
import {describe, test} from 'node:test';
import {
	BlackjackEngine,
	CUT_CARD_REMAINING,
	DECK_COUNT,
	createShoe,
	handValue,
	shuffle,
	type Card,
	type GameEvent,
	type Rank,
	type Rng,
	type Suit,
} from './engine.ts';

function card(rank: Rank, suit: Suit = 'spades'): Card {
	return {rank, suit};
}

/** Rigged engine drawing the given cards in order; cut card disabled. */
function rigged(cards: Array<[Rank, Suit?]>): BlackjackEngine {
	return new BlackjackEngine({
		shoe: cards.map(([rank, suit]) => card(rank, suit ?? 'spades')),
		cutCardRemaining: 0,
	});
}

function lcg(seed: number): Rng {
	let state = seed >>> 0;
	return () => {
		state = (state * 1664525 + 1013904223) >>> 0;
		return state / 2 ** 32;
	};
}

function eventsOf<T extends GameEvent['type']>(events: GameEvent[], type: T) {
	return events.filter((event): event is Extract<GameEvent, {type: T}> => event.type === type);
}

describe('handValue', () => {
	test('hard totals', () => {
		assert.deepEqual(handValue([card('K'), card('9')]), {total: 19, soft: false});
		assert.deepEqual(handValue([card('2'), card('3'), card('4')]), {total: 9, soft: false});
		assert.deepEqual(handValue([card('10'), card('J')]), {total: 20, soft: false});
	});

	test('soft totals count an Ace as 11', () => {
		assert.deepEqual(handValue([card('A'), card('6')]), {total: 17, soft: true});
		assert.deepEqual(handValue([card('A'), card('A')]), {total: 12, soft: true});
		assert.deepEqual(handValue([card('A'), card('A'), card('9')]), {total: 21, soft: true});
	});

	test('Aces demote to 1 when the hand would bust', () => {
		assert.deepEqual(handValue([card('A'), card('6'), card('9')]), {total: 16, soft: false});
		assert.deepEqual(handValue([card('A'), card('K'), card('Q')]), {total: 21, soft: false});
		assert.deepEqual(handValue([card('A'), card('A'), card('K'), card('9')]), {
			total: 21,
			soft: false,
		});
	});
});

describe('shoe', () => {
	test('a 6-deck shoe holds 312 cards', () => {
		assert.equal(createShoe(DECK_COUNT, lcg(1)).length, 312);
	});

	test('Fisher-Yates shuffle is a permutation', () => {
		const items = Array.from({length: 52}, (_, i) => i);
		const shuffled = shuffle([...items], lcg(7));
		assert.notDeepEqual(shuffled, items);
		assert.deepEqual([...shuffled].sort((a, b) => a - b), items);
	});

	test('cut card sits at 1/5 of the shoe', () => {
		assert.equal(CUT_CARD_REMAINING, Math.floor((6 * 52) / 5));
	});

	test('reshuffles at the cut card, not every hand', () => {
		// A 64-card rigged shoe with the real cut card (62): round one plays
		// without a shuffle, and the shoe reshuffles before round two once fewer
		// than a fifth of the shoe remains.
		const shoe: Card[] = [];
		for (let i = 0; i < 32; i++) {
			shoe.push(card('10', 'spades'), card('7', 'hearts'));
		}
		const engine = new BlackjackEngine({shoe, rng: lcg(3)});
		assert.equal(engine.cardsRemaining, 64);

		const first = engine.startRound(10);
		assert.equal(eventsOf(first, 'shuffle').length, 0);
		engine.act('stand');
		assert.ok(engine.cardsRemaining < CUT_CARD_REMAINING);

		const second = engine.startRound(10);
		assert.equal(eventsOf(second, 'shuffle').length, 1);
		assert.ok(engine.cardsRemaining > 300);
	});

	test('shuffles in a fresh shoe if it runs dry mid-round', () => {
		// Four cards exactly cover the opening deal; the first hit must come
		// from a freshly shuffled shoe instead of throwing.
		const engine = new BlackjackEngine({
			shoe: [card('10'), card('10', 'diamonds'), card('6', 'hearts'), card('6', 'clubs')],
			cutCardRemaining: 0,
			rng: lcg(42),
		});
		engine.startRound(10);
		assert.equal(engine.cardsRemaining, 0);

		const events = engine.act('hit');
		assert.equal(eventsOf(events, 'shuffle').length, 1);
		assert.equal(engine.hands[0]?.cards.length, 3);
		assert.ok(engine.cardsRemaining > 250);
	});
});

describe('naturals', () => {
	test('player blackjack pays 3:2', () => {
		// Deal order: player, dealer up, player, dealer hole.
		const engine = rigged([['A'], ['9', 'diamonds'], ['K', 'hearts'], ['5', 'clubs']]);
		const events = engine.startRound(100);

		assert.equal(eventsOf(events, 'playerBlackjack').length, 1);
		const [result] = eventsOf(events, 'handResult');
		assert.equal(result?.outcome, 'blackjack');
		assert.equal(result?.returns, 250);
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, 150);
		assert.equal(engine.phase, 'over');
	});

	test('player and dealer naturals push', () => {
		const engine = rigged([['A'], ['A', 'diamonds'], ['K', 'hearts'], ['Q', 'clubs']]);
		engine.startRound(100);
		assert.equal(engine.phase, 'insurance');

		const events = engine.resolveInsurance(false);
		assert.equal(eventsOf(events, 'peek')[0]?.hasBlackjack, true);
		const [result] = eventsOf(events, 'handResult');
		assert.equal(result?.outcome, 'push');
		assert.equal(result?.returns, 100);
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, 0);
	});

	test('a 21 made after splitting is not a blackjack', () => {
		// Split tens; each split hand draws an Ace for 21 and auto-stands.
		const engine = rigged([
			['10'],
			['9', 'diamonds'],
			['10', 'hearts'],
			['8', 'diamonds'],
			['A', 'clubs'],
			['A', 'diamonds'],
		]);
		engine.startRound(100);
		const events = engine.act('split');

		assert.equal(eventsOf(events, 'playerBlackjack').length, 0);
		const results = eventsOf(events, 'handResult');
		assert.equal(results.length, 2);
		// Dealer stands on 17; both 21s win 1:1, not 3:2.
		for (const result of results) {
			assert.equal(result.outcome, 'win');
			assert.equal(result.returns, 200);
		}
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, 200);
	});
});

describe('dealer', () => {
	test('stands on soft 17', () => {
		// Player 18 vs dealer A-6: dealer must stand on the soft 17 and lose.
		const engine = rigged([['10'], ['A', 'diamonds'], ['8', 'hearts'], ['6', 'clubs']]);
		engine.startRound(100);
		engine.resolveInsurance(false);
		const events = engine.act('stand');

		assert.equal(eventsOf(events, 'dealerHit').length, 0);
		assert.deepEqual(eventsOf(events, 'dealerStand')[0], {type: 'dealerStand', total: 17, soft: true});
		assert.equal(eventsOf(events, 'handResult')[0]?.outcome, 'win');
	});

	test('hits 16 and below', () => {
		const engine = rigged([
			['10'],
			['10', 'diamonds'],
			['8', 'hearts'],
			['6', 'clubs'],
			['5', 'diamonds'],
		]);
		engine.startRound(100);
		const events = engine.act('stand');

		const hits = eventsOf(events, 'dealerHit');
		assert.equal(hits.length, 1);
		assert.equal(hits[0]?.total, 21);
		assert.equal(eventsOf(events, 'handResult')[0]?.outcome, 'lose');
	});

	test('does not draw when every player hand busted', () => {
		const engine = rigged([
			['10'],
			['6', 'diamonds'],
			['8', 'hearts'],
			['10', 'clubs'],
			['9', 'diamonds'],
		]);
		engine.startRound(100);
		const events = engine.act('hit');

		assert.equal(eventsOf(events, 'playerBust')[0]?.total, 27);
		assert.equal(eventsOf(events, 'dealerHit').length, 0);
		assert.equal(eventsOf(events, 'dealerStand').length, 0);
		assert.equal(eventsOf(events, 'handResult')[0]?.outcome, 'bust');
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, -100);
	});
});

describe('double down', () => {
	test('allowed on any first two cards, takes one card, doubles the bet', () => {
		const engine = rigged([
			['5'],
			['10', 'diamonds'],
			['6', 'hearts'],
			['7', 'clubs'],
			['K', 'spades'],
		]);
		engine.startRound(100);
		assert.ok(engine.availableActions().includes('double'));

		const events = engine.act('double');
		assert.equal(eventsOf(events, 'double')[0]?.bet, 200);
		assert.equal(eventsOf(events, 'stake')[0]?.amount, 100);
		// One card only, then the hand is done and the dealer plays.
		assert.equal(eventsOf(events, 'playerCard').length, 1);
		const [result] = eventsOf(events, 'handResult');
		assert.equal(result?.outcome, 'win');
		assert.equal(result?.returns, 400);
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, 200);
	});

	test('not allowed after hitting', () => {
		const engine = rigged([
			['2'],
			['10', 'diamonds'],
			['3', 'hearts'],
			['7', 'clubs'],
			['4', 'spades'],
		]);
		engine.startRound(100);
		engine.act('hit');
		assert.ok(!engine.availableActions().includes('double'));
		assert.ok(!engine.availableActions().includes('split'));
		assert.throws(() => engine.act('double'));
	});
});

describe('splitting', () => {
	test('pairs only', () => {
		const engine = rigged([['10'], ['9', 'diamonds'], ['7', 'hearts'], ['5', 'clubs']]);
		engine.startRound(100);
		assert.ok(!engine.availableActions().includes('split'));
		assert.throws(() => engine.act('split'));
	});

	test('up to 3 splits for a maximum of 4 hands', () => {
		const eights: Array<[Rank, Suit?]> = [
			['8', 'spades'],
			['9', 'diamonds'],
			['8', 'hearts'],
			['8', 'diamonds'], // dealer hole -> 17
			['8', 'clubs'],
			['8', 'spades'],
			['8', 'hearts'],
			// Second cards dealt as each remaining hand becomes active.
			['2', 'clubs'],
			['3', 'clubs'],
			['4', 'clubs'],
			['9', 'clubs'], // dealer draws to 17... (9 + 8 = 17)
		];
		const engine = rigged(eights);
		engine.startRound(100);

		engine.act('split');
		engine.act('split');
		const events = engine.act('split');

		assert.equal(engine.hands.length, 4);
		assert.equal(eventsOf(events, 'split')[0]?.hands, 4);
		// A fourth split is illegal even though the active hand is a pair again.
		assert.ok(!engine.availableActions().includes('split'));

		while (engine.phase === 'player') {
			engine.act('stand');
		}
		assert.equal(engine.phase, 'over');
	});

	test('split Aces get exactly one card each and cannot be replayed', () => {
		const engine = rigged([
			['A'],
			['9', 'diamonds'],
			['A', 'hearts'],
			['8', 'diamonds'], // dealer 17
			['K', 'clubs'], // first hand -> 21 (not a natural)
			['4', 'diamonds'], // second hand -> 15
		]);
		engine.startRound(100);
		const events = engine.act('split');

		// Both hands resolved without any further player input.
		assert.equal(engine.phase, 'over');
		assert.equal(eventsOf(events, 'playerBlackjack').length, 0);

		const results = eventsOf(events, 'handResult');
		assert.equal(results[0]?.outcome, 'win'); // A+K = 21 beats 17, pays 1:1
		assert.equal(results[0]?.returns, 200);
		assert.equal(results[1]?.outcome, 'lose'); // A+4 = 15
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, 0);
	});
});

describe('insurance', () => {
	test('only offered against an Ace up-card', () => {
		const tenUp = rigged([['9'], ['K', 'diamonds'], ['8', 'hearts'], ['5', 'clubs']]);
		const events = tenUp.startRound(100);
		assert.equal(eventsOf(events, 'insuranceOffered').length, 0);
		assert.equal(tenUp.phase, 'player');
		assert.throws(() => tenUp.resolveInsurance(true));

		const aceUp = rigged([['9'], ['A', 'diamonds'], ['8', 'hearts'], ['5', 'clubs']]);
		const start = aceUp.startRound(100);
		assert.equal(eventsOf(start, 'insuranceOffered').length, 1);
		assert.equal(aceUp.phase, 'insurance');
	});

	test('costs half the bet and pays 2:1 when the dealer has blackjack', () => {
		const engine = rigged([['10'], ['A', 'diamonds'], ['9', 'hearts'], ['K', 'clubs']]);
		engine.startRound(100);
		const events = engine.resolveInsurance(true);

		assert.equal(eventsOf(events, 'insuranceTaken')[0]?.amount, 50);
		assert.equal(eventsOf(events, 'peek')[0]?.hasBlackjack, true);
		// 50 staked, 150 returned: the stake plus 100 in winnings.
		assert.equal(eventsOf(events, 'insurancePaid')[0]?.amount, 150);
		// The hand loses 100, insurance nets +100: a wash overall.
		assert.equal(eventsOf(events, 'handResult')[0]?.outcome, 'lose');
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, 0);
	});

	test('is lost when the dealer does not have blackjack', () => {
		const engine = rigged([
			['10'],
			['A', 'diamonds'],
			['9', 'hearts'],
			['9', 'clubs'], // dealer soft 20
		]);
		engine.startRound(100);
		const events = engine.resolveInsurance(true);

		assert.equal(eventsOf(events, 'peek')[0]?.hasBlackjack, false);
		assert.equal(eventsOf(events, 'insuranceLost').length, 1);
		assert.equal(engine.phase, 'player');

		const finish = engine.act('stand');
		// 19 loses to soft 20; bet and insurance both gone.
		assert.equal(eventsOf(finish, 'handResult')[0]?.outcome, 'lose');
		assert.equal(eventsOf(finish, 'roundOver')[0]?.net, -150);
	});

	test('declining costs nothing against a dealer blackjack', () => {
		const engine = rigged([['10'], ['A', 'diamonds'], ['9', 'hearts'], ['Q', 'clubs']]);
		engine.startRound(100);
		const events = engine.resolveInsurance(false);

		assert.equal(eventsOf(events, 'insurancePaid').length, 0);
		assert.equal(eventsOf(events, 'insuranceLost').length, 0);
		assert.equal(eventsOf(events, 'roundOver')[0]?.net, -100);
	});
});

describe('payouts', () => {
	test('standard win pays 1:1 and push returns the bet', () => {
		const win = rigged([['10'], ['10', 'diamonds'], ['9', 'hearts'], ['8', 'clubs']]);
		win.startRound(50);
		const winEvents = win.act('stand');
		assert.equal(eventsOf(winEvents, 'handResult')[0]?.returns, 100);
		assert.equal(eventsOf(winEvents, 'roundOver')[0]?.net, 50);

		const push = rigged([['10'], ['10', 'diamonds'], ['8', 'hearts'], ['8', 'clubs']]);
		push.startRound(50);
		const pushEvents = push.act('stand');
		assert.equal(eventsOf(pushEvents, 'handResult')[0]?.outcome, 'push');
		assert.equal(eventsOf(pushEvents, 'handResult')[0]?.returns, 50);
		assert.equal(eventsOf(pushEvents, 'roundOver')[0]?.net, 0);
	});
});
