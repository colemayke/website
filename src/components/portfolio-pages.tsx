import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {MessageGroup} from './message';
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
	design: 'design',
	software: 'software',
	hardware: 'hardware',
};

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
			<p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
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

function FeaturedProjectCard({
	project,
	trackProject,
	category,
}: {
	project: PortfolioProject;
	trackProject: PortfolioTrackProject;
	category: PortfolioCategory;
}) {
	const media = project.media?.[0];

	return (
		<article className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
			{media ? (
				<div className="mb-5">
					<ProjectMediaFigure media={media} variant="teaser" />
				</div>
			) : null}

			<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
				{project.eyebrow}
			</p>
			<h2 className="mt-2 font-[var(--font-serif)] text-3xl italic leading-tight text-neutral-900 dark:text-neutral-100">
				{project.title}
			</h2>
			<p className="mt-4 text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
				problem
			</p>
			<p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
				{trackProject.problem}
			</p>

			<div className="mt-5 flex flex-wrap gap-2">
				{project.stack.map(item => (
					<span
						key={`${project.slug}-${item}`}
						className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
					>
						{item}
					</span>
				))}
			</div>

			<p className="mt-5 text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
				what i did / what shipped
			</p>
			<p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
				{trackProject.shipped}
			</p>

			<div className="mt-5">
				<Link
					href={`${getCaseStudyHref(project.slug)}?track=${category}`}
					className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
				>
					View case study
				</Link>
			</div>
		</article>
	);
}

function SupportingProjectCard({
	project,
	trackProject,
	category,
}: {
	project: PortfolioProject;
	trackProject: PortfolioTrackProject;
	category: PortfolioCategory;
}) {
	return (
		<article className="rounded-[28px] border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
			<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
				{project.eyebrow}
			</p>
			<h3 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
				{project.title}
			</h3>
			<p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
				{trackProject.summary}
			</p>
			<div className="mt-4 flex flex-wrap gap-2">
				{project.stack.map(item => (
					<span
						key={`${project.slug}-${item}`}
						className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
					>
						{item}
					</span>
				))}
			</div>
			<div className="mt-4">
				<Link
					href={`${getCaseStudyHref(project.slug)}?track=${category}`}
					className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
				>
					View case study
				</Link>
			</div>
		</article>
	);
}

function HardwareDownloads() {
	return (
		<section className="rounded-[28px] border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
			<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
						downloads
					</p>
					<h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
						Lab PDFs and supporting files
					</h2>
				</div>
				<p className="max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
					Downloadable reports and lab files stay here so the hardware track still links directly to the published material.
				</p>
			</div>
			<div className="mt-5 grid gap-3 md:grid-cols-2">
				{portfolioDownloads.map(file => (
					<a
						key={file.href}
						href={file.href}
						target={file.fileType === 'PDF' ? '_blank' : undefined}
						rel={file.fileType === 'PDF' ? 'noreferrer' : undefined}
						download={file.fileType !== 'PDF' || undefined}
						className="rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-100"
					>
						<div className="flex items-center justify-between gap-3">
							<h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
								{file.title}
							</h3>
							<span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
								{file.fileType}
							</span>
						</div>
						<p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
							{file.description}
						</p>
					</a>
				))}
			</div>
		</section>
	);
}

export function ProjectsLandingPage() {
	const trackCards = portfolioTracks.map(track => {
		const featuredTitles = getTrackProjects(track.slug)
			.filter(({trackProject}) => trackProject.tier === 'featured')
			.slice(0, 2)
			.map(({project}) => project.title);

		return {
			track,
			featuredTitles,
		};
	});

	return (
		<div className="space-y-8">
			<ul className="space-y-3">
				<MessageGroup
					messages={[
						{
							key: 'projects-landing-1',
							content: <>My work is organized into three tracks: design, software, and hardware.</>,
						},
						{
							key: 'projects-landing-2',
							content: <>Each track starts with a concise index and links into full case studies.</>,
						},
					]}
				/>
			</ul>

			<div className="grid gap-4 lg:grid-cols-3">
				{trackCards.map(({track, featuredTitles}) => (
					<article
						key={track.slug}
						className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85"
					>
						<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
							{track.pageEyebrow}
						</p>
						<h2 className="mt-2 font-[var(--font-serif)] text-3xl italic leading-tight text-neutral-900 dark:text-neutral-100">
							{track.label}
						</h2>
						<p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
							{track.landingDescription}
						</p>
						{featuredTitles.length ? (
							<p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
								Featured: {featuredTitles.join(' + ')}
							</p>
						) : null}
						<div className="mt-5">
							<Link
								href={track.href}
								className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
							>
								Explore {track.label}
							</Link>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}

export function PortfolioTrackPage({category}: {category: PortfolioCategory}) {
	const track = portfolioTracks.find(item => item.slug === category)!;
	const trackProjects = getTrackProjects(category);
	const featuredProjects = trackProjects.filter(({trackProject}) => trackProject.tier === 'featured');
	const supportingProjects = trackProjects.filter(({trackProject}) => trackProject.tier === 'supporting');

	useEffect(() => {
		window.sessionStorage.setItem('portfolio-track-context', category);
	}, [category]);

	return (
		<div className="space-y-8">
			<ul className="space-y-3">
				<MessageGroup
					messages={track.introMessages.map((message, index) => ({
						key: `${track.slug}-intro-${index}`,
						content: <>{message}</>,
					}))}
				/>
			</ul>

			<section className="rounded-[28px] border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
				<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
					{track.pageEyebrow}
				</p>
				<h1 className="mt-2 font-[var(--font-serif)] text-4xl italic leading-tight text-neutral-900 dark:text-neutral-100">
					{track.pageTitle}
				</h1>
				<p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
					{track.pageDescription}
				</p>
				<div className="mt-5 flex flex-wrap gap-2">
					<Link
						href="/projects"
						className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
					>
						All tracks
					</Link>
					<a
						href="mailto:cole.am@outlook.com"
						className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
					>
						cole.am@outlook.com
					</a>
				</div>
			</section>

			<section className="space-y-4">
				<div>
					<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
						featured
					</p>
					<h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
						Featured projects
					</h2>
				</div>
				<div className="grid gap-4 lg:grid-cols-2">
					{featuredProjects.map(({project, trackProject}) => (
						<FeaturedProjectCard
							key={`${category}-${project.slug}`}
							project={project}
							trackProject={trackProject}
							category={category}
						/>
					))}
				</div>
			</section>

			{supportingProjects.length ? (
				<section className="space-y-4">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
							supporting
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
							Supporting projects
						</h2>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						{supportingProjects.map(({project, trackProject}) => (
							<SupportingProjectCard
								key={`${category}-${project.slug}`}
								project={project}
								trackProject={trackProject}
								category={category}
							/>
						))}
					</div>
				</section>
			) : null}

			{category === 'hardware' ? <HardwareDownloads /> : null}
		</div>
	);
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
						className="rounded-full border border-neutral-300 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
					>
						All tracks
					</Link>
					{project.categories.map(category => (
						<Link
							key={`${project.slug}-${category}`}
							href={`/projects/${category}`}
							className={clsx(
								'rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] transition-colors',
								normalizedTrack === category
									? 'border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
									: 'border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100',
							)}
						>
							{categoryLabels[category]}
						</Link>
					))}
				</div>

				<p className="mt-5 text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
					{project.eyebrow}
				</p>
				<h1 className="mt-2 font-[var(--font-serif)] text-4xl italic leading-tight text-neutral-900 dark:text-neutral-100">
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
				<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
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
				<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
					stack
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
				<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
					evidence
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
