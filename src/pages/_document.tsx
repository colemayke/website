import {Html, Head, Main, NextScript} from 'next/document';

// Runs before paint to apply the saved theme and avoid a flash of the wrong
// theme. Defaults to light when nothing is stored.
const themeScript = `(function () {
	try {
		var stored = localStorage.getItem('theme');
		if (stored === 'dark') {
			document.documentElement.classList.add('dark');
		}
	} catch (e) {}
})();`;

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script dangerouslySetInnerHTML={{__html: themeScript}} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
