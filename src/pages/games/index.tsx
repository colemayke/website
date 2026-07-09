import {motion} from 'framer-motion';
import Link from 'next/link';
import {SiteNav} from '../../components/site-nav';
import {games} from '../../utils/games';

export default function GamesPage() {
	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/games" />

			<p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
				Little games, played over text. More coming when I feel like it.
			</p>

			<ul className="space-y-2">
				{games.map((game, index) => (
					<motion.li
						key={game.slug}
						initial={{opacity: 0, y: 10}}
						animate={{opacity: 1, y: 0}}
						transition={{type: 'spring', stiffness: 480, damping: 32, delay: index * 0.06}}
					>
						<Link
							href={game.href}
							className="group flex items-center gap-3 rounded-3xl border border-neutral-200 bg-white/80 p-3 shadow-sm backdrop-blur transition-colors hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imsg dark:border-neutral-800 dark:bg-neutral-950/80 dark:hover:border-neutral-600"
						>
							<span
								aria-hidden="true"
								className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-lg text-white ring-1 ring-neutral-200 dark:bg-neutral-100 dark:text-neutral-900 dark:ring-neutral-800"
							>
								{game.glyph}
							</span>
							<span className="min-w-0 flex-1">
								<span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
									{game.title}
								</span>
								<span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
									{game.tagline}
								</span>
							</span>
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
								className="shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-700 dark:group-hover:text-neutral-400"
							>
								<path d="M9 18l6-6-6-6" />
							</svg>
						</Link>
					</motion.li>
				))}
			</ul>
		</main>
	);
}
