import {PortfolioTrackPage} from '../../components/portfolio-pages';
import {SiteNav} from '../../components/site-nav';

export default function HardwareProjectsPage() {
	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/projects/hardware" />
			<PortfolioTrackPage category="hardware" />
		</main>
	);
}
