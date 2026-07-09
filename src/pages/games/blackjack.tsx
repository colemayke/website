import {BlackjackTable} from '../../components/games/blackjack-table';
import {SiteNav} from '../../components/site-nav';

export default function BlackjackPage() {
	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/games" />
			<BlackjackTable />
		</main>
	);
}
