import {motion} from 'framer-motion';
import type {GetStaticProps} from 'next';
import Link from 'next/link';
import {SiSpotify} from 'react-icons/si';
import {useLanyardWS, type Data as LanyardData} from 'use-lanyard';
import album from '../../public/album.png';
import {FeaturedWork} from '../components/featured-work';
import {MessageGroup} from '../components/message';
import {SiteNav} from '../components/site-nav';
import {getLanyard} from '../server/lanyard';
import {discordId} from '../utils/constants';

export interface Props {
	lanyard: LanyardData;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const lanyard = await getLanyard(discordId);

	return {
		revalidate: 10,
		props: {
			lanyard,
		},
	};
};

const sectionMotion = {
	initial: {opacity: 0, y: 12},
	animate: {opacity: 1, y: 0},
	transition: {duration: 0.28},
};

export default function Home(props: Props) {
	const lanyard = useLanyardWS(discordId, {
		initialData: props.lanyard,
	})!;
	const showSpotify = Boolean(lanyard.spotify);

	return (
		<main className="mx-auto max-w-5xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/" />

			<div className="space-y-8">
				<motion.section {...sectionMotion} className="space-y-4">
					<ul className="space-y-3">
						<MessageGroup
							messages={[
								{
									key: 'home-intro-1',
									content: <>hi, i&apos;m cole.</>,
								},
								{
									key: 'home-intro-2',
									content: (
										<>
											i work across software, product, and ic design with an ece background.
										</>
									),
								},
							]}
						/>
						<MessageGroup
							messages={[
								{
									key: 'home-intro-3',
									content: <>currently at terrion. previously karrier one + rogers.</>,
								},
								{
									key: 'home-intro-4',
									content: (
										<>
											featured work is below. full case studies are organized by track in{' '}
											<Link
												href="/projects"
												className="nice-underline-neutral-400 dark:nice-underline-neutral-200/50"
											>
												projects
											</Link>
											.
										</>
									),
								},
							]}
						/>
						<MessageGroup
							messages={[
								{
									key: 'home-intro-5',
									content: (
										<>
											i&apos;ve built across telecom infrastructure, web3 products, and
											mixed-signal hardware — currently open to design engineering, software,
											and IC roles.
										</>
									),
								},
							]}
						/>
					</ul>

					<div className="flex flex-wrap gap-2">
						<a
							href="mailto:cole.am@outlook.com"
							className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
						>
							cole.am@outlook.com
						</a>
						<a
							href="https://www.linkedin.com/in/colemayke/"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
						>
							linkedin
						</a>
					</div>
				</motion.section>

				<motion.section {...sectionMotion}>
					<FeaturedWork />
				</motion.section>

				{showSpotify ? (
					<motion.section {...sectionMotion}>
						<div className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
							<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
								live now
							</p>
							<div className="mt-3 space-y-3">
								<p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
									what&apos;s currently on repeat.
								</p>
								<Link
									href={`https://open.spotify.com/track/${lanyard.spotify?.track_id}`}
									className="group relative block overflow-hidden rounded-[24px] p-4"
									target="_blank"
								>
									<div className="absolute -inset-[1px] rounded-[24px] border-[3px] border-black/10 dark:border-white/20" />
									<div className="absolute inset-0">
										<div className="absolute inset-0 z-10 bg-white/70 group-hover:bg-white/80 dark:bg-neutral-800/80 dark:group-hover:bg-neutral-800/90" />
										<img
											src={lanyard.spotify?.album_art_url ?? album.src}
											alt="Album art"
											aria-hidden
											className="absolute top-1/2 -translate-y-1/2 scale-[3] blur-3xl saturate-[15] dark:saturate-[10]"
										/>
									</div>

									<div className="relative z-10 flex items-center gap-4 pr-8">
										<img
											src={lanyard.spotify?.album_art_url ?? album.src}
											alt="Album art"
											className="size-14 rounded-md border-2"
										/>
										<div className="min-w-0 space-y-1">
											<p className="line-clamp-1 text-sm">
												<strong>{lanyard.spotify?.song}</strong>
											</p>
											<p className="line-clamp-1 text-sm text-neutral-800 dark:text-white/60">
												{lanyard.spotify?.artist.split('; ').join(', ')}
											</p>
										</div>
									</div>

									<div className="absolute right-4 top-4 z-10">
										<SiSpotify className="size-4 text-neutral-900/80 dark:text-white/50" />
									</div>
								</Link>
							</div>
						</div>
					</motion.section>
				) : null}
			</div>
		</main>
	);
}
