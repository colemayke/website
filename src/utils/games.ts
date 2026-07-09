export interface GameEntry {
	slug: string;
	title: string;
	tagline: string;
	/** Glyph shown in the game's avatar circle, iMessage-contact style. */
	glyph: string;
	href: string;
}

export const games: GameEntry[] = [
	{
		slug: 'blackjack',
		title: 'Blackjack',
		tagline: 'Six decks, 3:2 naturals, dealer stands on 17. Play a hand over text.',
		glyph: '♠',
		href: '/games/blackjack',
	},
];
