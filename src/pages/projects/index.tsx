import {ProjectsLandingPage} from '../../components/portfolio-pages';
import {SiteNav} from '../../components/site-nav';

export default function ProjectsLanding() {
	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/projects" />
			<ProjectsLandingPage />
		</main>
	);
}
