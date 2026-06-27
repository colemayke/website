import {useEffect, useState} from 'react';

export type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.classList.toggle('dark', theme === 'dark');
}

/**
 * Class-based light/dark theme. Defaults to light; the choice persists in
 * localStorage. The initial class is set pre-paint in `_document` to avoid a
 * flash, so this hook just syncs React state and reacts to toggles.
 */
export function useTheme() {
	const [theme, setTheme] = useState<Theme>('light');

	useEffect(() => {
		const stored = (() => {
			try {
				return localStorage.getItem('theme');
			} catch {
				return null;
			}
		})();

		setTheme(stored === 'dark' ? 'dark' : 'light');
	}, []);

	const setAndPersist = (next: Theme) => {
		setTheme(next);
		applyTheme(next);
		try {
			localStorage.setItem('theme', next);
		} catch {}
	};

	const toggle = () => {
		setAndPersist(theme === 'dark' ? 'light' : 'dark');
	};

	return {theme, setTheme: setAndPersist, toggle};
}
