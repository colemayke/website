import clsx from 'clsx';
import Link from 'next/link';
import {useTheme} from '../hooks/use-theme';

const navItems = [
	{href: '/', label: 'Home'},
	{href: '/experience', label: 'Experience'},
	{href: '/projects/design', label: 'Design'},
	{href: '/projects/software', label: 'Software'},
	{href: '/projects/hardware', label: 'Hardware'},
	{href: '/games', label: 'Games'},
];

export function SiteNav({currentPath}: {currentPath: string}) {
	return (
		<header className="mb-10 flex flex-wrap items-center justify-between gap-3">
			<div>
				<Link
					href="/"
					className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
				>
					Cole Mayke
				</Link>
				<p className="text-xs text-neutral-500 dark:text-neutral-400">
					Toronto, Ontario
				</p>
			</div>

			<div className="flex w-full min-w-0 items-center justify-end gap-2 sm:w-auto">
				<nav className="flex min-w-0 flex-wrap items-center justify-center gap-1 rounded-3xl border border-neutral-200 bg-white/80 p-1 text-sm shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80 sm:flex-nowrap sm:rounded-full">
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

				<ThemeToggle />
			</div>
		</header>
	);
}

function ThemeToggle() {
	const {theme, toggle} = useTheme();
	const isDark = theme === 'dark';

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 shadow-sm backdrop-blur transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
		>
			{isDark ? <SunIcon /> : <MoonIcon />}
		</button>
	);
}

function SunIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
		</svg>
	);
}

function MoonIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	);
}
