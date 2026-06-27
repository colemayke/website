import {motion} from 'framer-motion';
import Link from 'next/link';
import {SiteNav} from '../components/site-nav';
import {education, experienceCompanies, skillGroups} from '../utils/experience';

const sectionMotion = {
	initial: {opacity: 0, y: 12},
	animate: {opacity: 1, y: 0},
	transition: {duration: 0.28},
};

export default function ExperiencePage() {
	return (
		<main className="mx-auto max-w-5xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/experience" />

			<div className="space-y-8">
				<motion.section {...sectionMotion}>
					<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
						Experience
					</p>
					<h1 className="mt-2 font-[var(--font-serif)] text-4xl italic leading-tight text-neutral-900 dark:text-neutral-100">
						Design & software engineer
					</h1>
					<p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
						I build products end to end — from interface and front-end to the systems, data,
						and AI behind them — across telecom, fintech, and web3. Below is the working
						timeline; case studies live in{' '}
						<Link
							href="/projects"
							className="nice-underline-neutral-400 dark:nice-underline-neutral-200/50"
						>
							projects
						</Link>
						.
					</p>
				</motion.section>

				<motion.section {...sectionMotion} className="space-y-4">
					{experienceCompanies.map(company => (
						<article
							key={company.company}
							className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85"
						>
							<div className="flex flex-wrap items-baseline justify-between gap-2">
								<h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
									{company.company}
								</h2>
								<p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
									{company.location}
								</p>
							</div>

							<div className="mt-4 space-y-5">
								{company.roles.map(role => (
									<div
										key={`${company.company}-${role.title}`}
										className="border-l border-neutral-200 pl-4 dark:border-neutral-800"
									>
										<div className="flex flex-wrap items-baseline justify-between gap-x-3">
											<h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
												{role.title}
											</h3>
											<p className="text-xs text-neutral-500 dark:text-neutral-400">
												{role.period}
											</p>
										</div>
										<ul className="mt-2 space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
											{role.points.map(point => (
												<li key={point} className="flex gap-3">
													<span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
													<span>{point}</span>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</article>
					))}
				</motion.section>

				<motion.section {...sectionMotion}>
					<div className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
						<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
							Skills
						</p>
						<div className="mt-4 space-y-4">
							{skillGroups.map(group => (
								<div
									key={group.label}
									className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4"
								>
									<p className="w-40 shrink-0 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
										{group.label}
									</p>
									<div className="flex flex-wrap gap-2">
										{group.items.map(item => (
											<span
												key={`${group.label}-${item}`}
												className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
											>
												{item}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</motion.section>

				<motion.section {...sectionMotion}>
					<div className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
						<p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
							Education
						</p>
						<div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
							<div>
								<h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
									{education.school}
								</h2>
								<p className="mt-1 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
									{education.credential}
								</p>
							</div>
							<p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
								{education.location} · {education.year}
							</p>
						</div>
					</div>
				</motion.section>
			</div>
		</main>
	);
}
