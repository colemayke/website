import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {type ReactNode, useEffect} from 'react';
import {Conversation, type ConversationTurn} from './conversation';
import {
	getCaseStudyHref,
	getTrackProjects,
	portfolioDownloads,
	portfolioTracks,
	type PortfolioCategory,
	type PortfolioEvidence,
	type PortfolioLink,
	type PortfolioMedia,
	type PortfolioProject,
	type PortfolioTrackProject,
} from '../utils/portfolio';

const categoryLabels: Record<PortfolioCategory, string> = {
	design: 'Design',
	software: 'Software',
	hardware: 'Hardware',
};

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

function EvidenceCard({
	label,
	value,
}: {
	label: keyof PortfolioEvidence;
	value: string;
}) {
	return (
		<div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
			<p className="text-[11px] capitalize text-neutral-500 dark:text-neutral-400">
				{label}
			</p>
			<p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{value}</p>
		</div>
	);
}

function ProjectMediaFigure({
	media,
	variant = 'case-study',
}: {
	media: PortfolioMedia;
	variant?: 'case-study' | 'teaser';
}) {
	const sharedClassName =
		variant === 'teaser'
			? clsx(
					'h-60 w-full md:h-64',
					media.fit === 'contain' ? 'object-contain' : 'object-cover object-top',
				)
			: 'h-[320px] w-full object-contain md:h-[420px]';

	return (
		<figure className="flex h-full flex-col overflow-hidden rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-2 dark:border-neutral-800 dark:bg-neutral-900/70">
			<div className="overflow-hidden rounded-[18px] bg-neutral-100 dark:bg-neutral-950">
				{media.type === 'image' ? (
					<img src={media.src} alt={media.label} loading="lazy" className={sharedClassName} />
				) : (
					<video
						src={media.src}
						poster={media.poster}
						controls
						preload="metadata"
						playsInline
						aria-label={media.label}
						className={clsx(sharedClassName, 'bg-neutral-950')}
					>
						Your browser does not support embedded video playback.
					</video>
				)}
			</div>
			{media.caption && variant === 'case-study' ? (
				<figcaption className="px-2 pb-1 pt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
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
							<div className="mt-1 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
								<img
									src={media.src}
									alt={media.label}
									loading="lazy"
									className={clsx(
										'h-40 w-72 max-w-full',
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

	return (
		<div className="space-y-8">
			<section className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
				<div className="flex flex-wrap gap-2">
					<Link
						href="/projects"
						className="rounded-full border border-neutral-300 px-2.5 py-1 text-[11px] text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
					>
						All work
					</Link>
					{project.categories.map(category => (
						<Link
							key={`${project.slug}-${category}`}
							href={`/projects/${category}`}
							className={clsx(
								'rounded-full border px-2.5 py-1 text-[11px] transition-colors',
								normalizedTrack === category
									? 'border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
									: 'border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100',
							)}
						>
							{categoryLabels[category]}
						</Link>
					))}
				</div>

				<p className="mt-5 text-xs text-neutral-500 dark:text-neutral-400">
					{project.eyebrow}
				</p>
				<h1 className="mt-2 text-4xl font-semibold tracking-tight leading-tight text-neutral-900 dark:text-neutral-100">
					{project.title}
				</h1>
				<p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700 dark:text-neutral-300">
					{project.summary}
				</p>

				{project.links.length ? (
					<div className="mt-5 flex flex-wrap gap-2">
						{project.links.map(link => (
							<ExternalAction key={`${project.slug}-${link.href}`} link={link} />
						))}
					</div>
				) : null}
			</section>

			{project.media?.length ? (
				<section className="grid gap-3 md:grid-cols-2">
					{project.media.map(media => (
						<div
							key={`${project.slug}-${media.src}`}
							className={clsx(media.layout === 'half' ? 'md:col-span-1' : 'md:col-span-2')}
						>
							<ProjectMediaFigure media={media} />
						</div>
					))}
				</section>
			) : null}

			<section className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
				<p className="text-xs text-neutral-500 dark:text-neutral-400">
					{project.sectionTitle}
				</p>
				<ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
					{project.points.map(point => (
						<li key={point} className="flex gap-3">
							<span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
							<span>{point}</span>
						</li>
					))}
				</ul>
			</section>

			<section className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
				<p className="text-xs text-neutral-500 dark:text-neutral-400">
					Stack
				</p>
				<div className="mt-3 flex flex-wrap gap-2">
					{project.stack.map(item => (
						<span
							key={`${project.slug}-${item}`}
							className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
						>
							{item}
						</span>
					))}
				</div>
			</section>

			<section className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
				<p className="text-xs text-neutral-500 dark:text-neutral-400">
					Evidence
				</p>
				<div className="mt-3 grid gap-3 md:grid-cols-2">
					<EvidenceCard label="role" value={project.evidence.role} />
					<EvidenceCard label="problem" value={project.evidence.problem} />
					<EvidenceCard label="ownership" value={project.evidence.ownership} />
					<EvidenceCard label="outcome" value={project.evidence.outcome} />
					<div className="md:col-span-2">
						<EvidenceCard label="artifact" value={project.evidence.artifact} />
					</div>
				</div>
			</section>

			{project.note ? (
				<p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">{project.note}</p>
			) : null}
		</div>
	);
}
