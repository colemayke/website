import type {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import {PortfolioCaseStudyPage} from '../../components/portfolio-pages';
import {SiteNav} from '../../components/site-nav';
import {getPortfolioProject, portfolioProjects, type PortfolioProject} from '../../utils/portfolio';

interface CaseStudyProps {
	project: PortfolioProject;
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: portfolioProjects.map(project => ({
			params: {
				slug: project.slug,
			},
		})),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<CaseStudyProps> = async context => {
	const slug = context.params?.slug;
	const project = typeof slug === 'string' ? getPortfolioProject(slug) : null;

	if (!project) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			project,
		},
	};
};

export default function ProjectCaseStudyPage({project}: CaseStudyProps) {
	const router = useRouter();
	const activeTrack =
		typeof router.query.track === 'string' &&
		(router.query.track === 'design' ||
			router.query.track === 'software' ||
			router.query.track === 'hardware')
			? `/projects/${router.query.track}`
			: '';

	return (
		<main className="mx-auto max-w-5xl px-3 pb-16 pt-10">
			<SiteNav currentPath={activeTrack} />
			<PortfolioCaseStudyPage project={project} />
		</main>
	);
}
