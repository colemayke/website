import clsx from 'clsx';
import Link from 'next/link';

const navItems = [
	{href: '/', label: 'home'},
	{href: '/projects/design', label: 'design'},
	{href: '/projects/software', label: 'software'},
	{href: '/projects/hardware', label: 'hardware'},
	{href: '/personal', label: 'personal'},
];

export function SiteNav({currentPath}: {currentPath: string}) {
	return (
		<header className="mb-10 flex flex-wrap items-center justify-between gap-3">
			<div>
				<Link
					href="/"
					className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
				>
					cole mayke
				</Link>
				<p className="text-xs text-neutral-500 dark:text-neutral-400">
					portfolio, case studies, and engineering work
				</p>
			</div>

			<nav className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white/80 p-1 text-sm shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
				{navItems.map(item => (
					<Link
						key={item.href}
						href={item.href}
						className={clsx(
							'rounded-full px-3 py-1.5 transition-colors',
							currentPath === item.href
								? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900'
								: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-100',
						)}
					>
						{item.label}
					</Link>
				))}
			</nav>
		</header>
	);
}
