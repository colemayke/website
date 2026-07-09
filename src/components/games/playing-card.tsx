import clsx from 'clsx';
import {motion, useReducedMotion} from 'framer-motion';
import type {Card} from '../../games/blackjack/engine';

const suitGlyphs: Record<Card['suit'], string> = {
	spades: '♠',
	hearts: '♥',
	diamonds: '♦',
	clubs: '♣',
};

const suitNames: Record<Card['suit'], string> = {
	spades: 'Spades',
	hearts: 'Hearts',
	diamonds: 'Diamonds',
	clubs: 'Clubs',
};

const rankNames: Record<Card['rank'], string> = {
	'A': 'Ace',
	'2': 'Two',
	'3': 'Three',
	'4': 'Four',
	'5': 'Five',
	'6': 'Six',
	'7': 'Seven',
	'8': 'Eight',
	'9': 'Nine',
	'10': 'Ten',
	'J': 'Jack',
	'Q': 'Queen',
	'K': 'King',
};

export function cardName(card: Card): string {
	return `${rankNames[card.rank]} of ${suitNames[card.suit]}`;
}

/** Short inline form for chat narration, e.g. "K♠". */
export function cardShorthand(card: Card): string {
	return `${card.rank}${suitGlyphs[card.suit]}`;
}

export function PlayingCard({card, faceDown = false}: {card: Card; faceDown?: boolean}) {
	const reduce = useReducedMotion();
	const red = card.suit === 'hearts' || card.suit === 'diamonds';

	return (
		<motion.div
			initial={reduce ? false : {opacity: 0, y: -14, scale: 0.85}}
			animate={{opacity: 1, y: 0, scale: 1}}
			transition={{type: 'spring', stiffness: 480, damping: 32}}
			className="relative h-[4.25rem] w-12 shrink-0 [perspective:400px]"
			role="img"
			aria-label={faceDown ? 'Face-down card' : cardName(card)}
		>
			<motion.div
				initial={false}
				animate={{rotateY: faceDown ? 180 : 0}}
				transition={reduce ? {duration: 0} : {type: 'spring', stiffness: 260, damping: 26}}
				className="absolute inset-0 [transform-style:preserve-3d]"
			>
				{/* Face */}
				<div
					className={clsx(
						'absolute inset-0 flex flex-col justify-between rounded-lg border border-neutral-300/70 bg-white p-1 shadow-sm [backface-visibility:hidden] dark:border-neutral-600',
						red ? 'text-red-500' : 'text-neutral-900',
					)}
				>
					<div className="text-[10px] font-semibold leading-none">
						{card.rank}
						<div className="text-[9px]">{suitGlyphs[card.suit]}</div>
					</div>
					<div className="self-center text-base leading-none">{suitGlyphs[card.suit]}</div>
					<div className="rotate-180 text-[10px] font-semibold leading-none">
						{card.rank}
						<div className="text-[9px]">{suitGlyphs[card.suit]}</div>
					</div>
				</div>

				{/* Back */}
				<div className="absolute inset-0 rounded-lg border border-neutral-300/70 bg-imsg p-1 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-neutral-600">
					<div className="flex h-full w-full items-center justify-center rounded-md border border-white/30 text-sm text-white/50">
						♠
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
