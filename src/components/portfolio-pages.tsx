import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {type ReactNode, useEffect} from 'react';
import {ChatImage, Conversation, type ConversationTurn} from './conversation';
import {
	getCaseStudyHref,
	getTrackProjects,
	portfolioDownloads,
	portfolioTracks,
	type PortfolioCategory,
	type PortfolioLink,
	type PortfolioMedia,
	type PortfolioProject,
	type PortfolioTrackProject,
} from '../utils/portfolio';

const trackPrompts: Record<PortfolioCategory, string> = {
	design: 'What design work have you done?',
	software: 'What software engineering have you done?',
	hardware: 'What hardware have you worked on?',
};

const bubbleLink = 'nice-underline-neutral-400 dark:nice-underline-neutral-200/50';

type Bubble = {key: string; content: ReactNode};

function ExternalAction({link}: {link: PortfolioLink}) {
	return (
		<a
			href={link.href}
			target={link.external ? '_blank' : undefined}
			rel={link.external ? 'noreferrer' : undefined}
			download={link.download || undefined}
			className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
		>
			{link.label}
		</a>
	);
}

function CaseMedia({media}: {media: PortfolioMedia}) {
	const isContain = media.fit === 'contain';

	return (
		<figure className="mx-auto max-w-4xl">
			<div
				className={clsx(
					'overflow-hidden rounded-[28px] border border-neutral-200 dark:border-neutral-800',
					isContain ? 'bg-neutral-50 dark:bg-neutral-900' : 'bg-neutral-100 dark:bg-neutral-950',
				)}
			>
				{media.type === 'image' ? (
					<img
						src={media.src}
						alt={media.label}
						loading="lazy"
						className={clsx(
							'w-full',
							isContain ? 'max-h-[72vh] object-contain' : 'h-auto object-cover',
						)}
					/>
				) : (
					<video
						src={media.src}
						poster={media.poster}
						controls
						preload="metadata"
						playsInline
						aria-label={media.label}
						className="w-full bg-neutral-950"
					>
						Your browser does not support embedded video playback.
					</video>
				)}
			</div>
			{media.caption ? (
				<figcaption className="mt-4 text-center text-sm leading-6 text-neutral-500 dark:text-neutral-400">
					{media.caption}
				</figcaption>
			) : null}
		</figure>
	);
}

function projectBubbles(
	project: PortfolioProject,
	trackProject: PortfolioTrackProject,
	category: PortfolioCategory,
): Bubble[] {
	const media = project.media?.find(item => item.type === 'image');
	const externalLink = project.links.find(link => link.external || link.download);

	return [
		{
			key: `${project.slug}-title`,
			content: (
				<>
					<span className="font-semibold">{project.title}</span>
					<span className="text-neutral-500 dark:text-neutral-400"> · {project.eyebrow}</span>
				</>
			),
		},
		...(media
			? [
					{
						key: `${project.slug}-media`,
						content: (
							<div className="mt-1">
								<ChatImage
									src={media.src}
									alt={media.label}
									className={clsx(
										'h-40 w-72 hover:h-60 hover:w-[24rem]',
										media.fit === 'contain'
											? 'bg-neutral-50 object-contain dark:bg-neutral-950'
											: 'object-cover object-top',
									)}
								/>
							</div>
						),
					},
				]
			: []),
		{
			key: `${project.slug}-summary`,
			content: <>{trackProject.summary}</>,
		},
		{
			key: `${project.slug}-stack`,
			content: (
				<span className="text-neutral-500 dark:text-neutral-400">
					{project.stack.join(' · ')}
				</span>
			),
		},
		{
			key: `${project.slug}-actions`,
			content: (
				<span className="flex flex-wrap items-center gap-x-4 gap-y-1">
					<Link
						href={`${getCaseStudyHref(project.slug)}?track=${category}`}
						className={bubbleLink}
					>
						View case study →
					</Link>
					{externalLink ? (
						<a
							href={externalLink.href}
							target={externalLink.external ? '_blank' : undefined}
							rel={externalLink.external ? 'noreferrer' : undefined}
							download={externalLink.download || undefined}
							className={bubbleLink}
						>
							{externalLink.label} →
						</a>
					) : null}
				</span>
			),
		},
	];
}

function downloadBubbles(): Bubble[] {
	return [
		{
			key: 'downloads-head',
			content: <>Lab PDFs and supporting files, if you want the source material:</>,
		},
		{
			key: 'downloads-list',
			content: (
				<ul className="space-y-1.5">
					{portfolioDownloads.map(file => (
						<li key={file.href}>
							<a
								href={file.href}
								target={file.fileType === 'PDF' ? '_blank' : undefined}
								rel={file.fileType === 'PDF' ? 'noreferrer' : undefined}
								download={file.fileType !== 'PDF' || undefined}
								className={bubbleLink}
							>
								{file.title}
							</a>
							<span className="text-neutral-500 dark:text-neutral-400"> · {file.fileType}</span>
						</li>
					))}
				</ul>
			),
		},
	];
}

export function ProjectsLandingPage() {
	const turns: ConversationTurn[] = [
		{kind: 'prompt', key: 'pl-q', text: 'What have you worked on?'},
		...portfolioTracks.map((track): ConversationTurn => {
			const featuredTitles = getTrackProjects(track.slug)
				.filter(({trackProject}) => trackProject.tier === 'featured')
				.slice(0, 2)
				.map(({project}) => project.title);

			return {
				kind: 'reply',
				key: track.slug,
				messages: [
					{key: `${track.slug}-label`, content: <span className="font-semibold">{track.label}</span>},
					{key: `${track.slug}-desc`, content: <>{track.landingDescription}</>},
					...(featuredTitles.length
						? [
								{
									key: `${track.slug}-featured`,
									content: (
										<span className="text-neutral-500 dark:text-neutral-400">
											Featured: {featuredTitles.join(', ')}
										</span>
									),
								},
							]
						: []),
					{
						key: `${track.slug}-link`,
						content: (
							<Link href={track.href} className={bubbleLink}>
								Explore {track.label.toLowerCase()} →
							</Link>
						),
					},
				],
			};
		}),
	];

	return <Conversation turns={turns} />;
}

export function PortfolioTrackPage({category}: {category: PortfolioCategory}) {
	const track = portfolioTracks.find(item => item.slug === category)!;
	const trackProjects = getTrackProjects(category);

	useEffect(() => {
		window.sessionStorage.setItem('portfolio-track-context', category);
	}, [category]);

	const turns: ConversationTurn[] = [
		{kind: 'prompt', key: `${track.slug}-q`, text: trackPrompts[category]},
		...trackProjects.map(
			({project, trackProject}): ConversationTurn => ({
				kind: 'reply',
				key: `${category}-${project.slug}`,
				messages: projectBubbles(project, trackProject, category),
			}),
		),
		...(category === 'hardware'
			? ([
					{kind: 'prompt', key: 'dl-q', text: 'Anything I can download?'},
					{kind: 'reply', key: 'downloads', messages: downloadBubbles()},
				] as ConversationTurn[])
			: []),
		{
			kind: 'reply',
			key: `${track.slug}-cta`,
			messages: [
				{
					key: 'cta-1',
					content: (
						<>
							Reach me at{' '}
							<a href="mailto:cole.am@outlook.com" className={bubbleLink}>
								cole.am@outlook.com
							</a>
							.
						</>
					),
				},
			],
		},
	];

	return <Conversation turns={turns} />;
}

export function PortfolioCaseStudyPage({project}: {project: PortfolioProject}) {
	const router = useRouter();
	const activeTrack = router.query.track;
	const normalizedTrack =
		typeof activeTrack === 'string' &&
		(activeTrack === 'design' || activeTrack === 'software' || activeTrack === 'hardware')
			? activeTrack
			: null;

	useEffect(() => {
		if (normalizedTrack) {
			window.sessionStorage.setItem('portfolio-track-context', normalizedTrack);
		}
	}, [normalizedTrack]);

	const media = project.media ?? [];
	const leadMedia = media[0];
	const restMedia = media.slice(1);

	return (
		<article className="space-y-16 pb-4 md:space-y-24">
			<header className="mx-auto max-w-2xl pt-2 text-center">
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Link
						href="/projects"
						className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
					>
						All work
					</Link>
					<Link
						href="/"
						className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
					>
						Home
					</Link>
				</div>

				<p className="mt-10 text-sm text-neutral-500 dark:text-neutral-400">{project.eyebrow}</p>
				<h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-6xl">
					{project.title}
				</h1>
				<p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
					{project.summary}
				</p>

				{project.links.length ? (
					<div className="mt-7 flex flex-wrap justify-center gap-2">
						{project.links.map(link => (
							<ExternalAction key={`${project.slug}-${link.href}`} link={link} />
						))}
					</div>
				) : null}
			</header>

			{leadMedia ? <CaseMedia media={leadMedia} /> : null}

			<section className="mx-auto max-w-2xl">
				<h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-3xl">
					{project.sectionTitle}
				</h2>
				<div className="mt-8 space-y-5">
					{project.points.map(point => (
						<p key={point} className="text-lg leading-8 text-neutral-700 dark:text-neutral-300">
							{point}
						</p>
					))}
				</div>
			</section>

			{restMedia.length ? (
				<section className="space-y-10">
					{restMedia.map(item => (
						<CaseMedia key={`${project.slug}-${item.src}`} media={item} />
					))}
				</section>
			) : null}

			<section className="mx-auto max-w-2xl text-center">
				<p className="text-sm text-neutral-500 dark:text-neutral-400">Outcome</p>
				<p className="mt-4 text-2xl font-medium leading-9 tracking-tight text-neutral-900 dark:text-neutral-100 md:text-[1.75rem] md:leading-[1.4]">
					{project.evidence.outcome}
				</p>
			</section>

			<section className="mx-auto max-w-2xl border-t border-neutral-200 pt-10 dark:border-neutral-800">
				<dl className="grid gap-8 sm:grid-cols-2">
					<div>
						<dt className="text-sm text-neutral-500 dark:text-neutral-400">Role</dt>
						<dd className="mt-2 text-base leading-7 text-neutral-800 dark:text-neutral-200">
							{project.evidence.role}
						</dd>
					</div>
					<div>
						<dt className="text-sm text-neutral-500 dark:text-neutral-400">Built with</dt>
						<dd className="mt-3 flex flex-wrap gap-2">
							{project.stack.map(item => (
								<span
									key={`${project.slug}-${item}`}
									className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
								>
									{item}
								</span>
							))}
						</dd>
					</div>
				</dl>
				{project.note ? (
					<p className="mt-8 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
						{project.note}
					</p>
				) : null}
			</section>
		</article>
	);
}
