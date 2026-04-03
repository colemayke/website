import {PortfolioTrackPage} from '../../components/portfolio-pages';
import {SiteNav} from '../../components/site-nav';

export default function DesignProjectsPage() {
	return (
		<main className="mx-auto max-w-5xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/projects/design" />
			<PortfolioTrackPage category="design" />
		</main>
	);
}
