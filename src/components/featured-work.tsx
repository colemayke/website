import Link from 'next/link';
import {featuredPortfolioProjects} from '../utils/portfolio';

export function FeaturedWork() {
	const projects = featuredPortfolioProjects.slice(0, 4);

	return (
		<section className="space-y-3">
			<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 className="text-3xl font-semibold tracking-tight leading-tight text-neutral-900 dark:text-neutral-100">
						Start here
					</h2>
				</div>
				<Link
					href="/projects"
					className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
				>
					See all projects
				</Link>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{projects.map(project => (
					<article
						key={project.slug}
						className="rounded-[28px] border border-neutral-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80"
					>
						<div className="flex flex-wrap gap-2">
							{project.categories.map(category => (
								<span
									key={`${project.slug}-${category}`}
									className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] capitalize text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
								>
									{category}
								</span>
							))}
						</div>

						<h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
							{project.title}
						</h3>
						<p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
							{project.featuredSummary ?? project.summary}
						</p>

						<div className="mt-4 flex flex-wrap gap-2">
							<Link
								href={`/projects/${project.slug}`}
								className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-700 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
							>
								View case study
							</Link>
							{project.links[0] ? (
								<a
									href={project.links[0].href}
									target={project.links[0].external ? '_blank' : undefined}
									rel={project.links[0].external ? 'noreferrer' : undefined}
									download={project.links[0].download || undefined}
									className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
								>
									{project.links[0].label}
								</a>
							) : null}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
