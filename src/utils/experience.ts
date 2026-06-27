export interface ExperienceRole {
	title: string;
	period: string;
	points: string[];
}

export interface ExperienceCompany {
	company: string;
	location: string;
	roles: ExperienceRole[];
}

export interface SkillGroup {
	label: string;
	items: string[];
}

export interface EducationEntry {
	school: string;
	location: string;
	credential: string;
	year: string;
}

export const experienceCompanies: ExperienceCompany[] = [
	{
		company: 'Terrion',
		location: 'Toronto, Ontario',
		roles: [
			{
				title: 'Design Specialist II',
				period: 'February 2026 – Present',
				points: [
					'Built AI automation pipelines that draft and process commercial lease agreements, and shipped AI agents that work alongside the real-estate team to run leasing workflows.',
					'Engineered data pipelines syncing Salesforce and BigQuery on GCP, with infrastructure defined as code in Pulumi, keeping customer-facing product surfaces backed by live data.',
					'Built an interactive network explorer map (React, Mapbox GL JS) that surfaces live tower inventory from BigQuery, generating inbound leads through a self-serve interface.',
					'Rebuilt the public website in Next.js with server-side rendering, improving page-load performance and search ranking.',
				],
			},
		],
	},
	{
		company: 'Karrier One',
		location: 'Toronto, Ontario',
		roles: [
			{
				title: 'Product Lead',
				period: 'June 2025 – February 2026',
				points: [
					'Led a 10+ person cross-functional design and engineering team, shipping across telecom, fintech, and web3.',
					'Directed the design and launch of a unified banking and telecom mobile app (Flutter) integrating digital identity, on-chain payments, and connectivity.',
					'Drove the launch of a carrier-grade cellular data offloading network, scaling to 1,000+ devices, 1M+ unique Wi-Fi users, and 400,000+ GB of offloaded data.',
				],
			},
			{
				title: 'Software Engineer',
				period: 'May 2023 – May 2025',
				points: [
					'Architected the Karrier One web platform front-end in Next.js and TypeScript, implementing server-side rendering and Core Web Vitals optimization across public-facing surfaces.',
					'Built a real-time monitoring and on-chain wallet-management dashboard in TypeScript and .NET (AWS, Docker), serving thousands of active nodes with low-latency delivery.',
					'Authored and deployed production Move smart contracts on Sui powering decentralized identity and payments, processing over $4.0M in on-chain revenue and funding.',
				],
			},
		],
	},
	{
		company: 'Gambit Technologies',
		location: 'Waterloo, Ontario',
		roles: [
			{
				title: 'Software Engineer (Contract)',
				period: 'April 2024 – October 2024',
				points: [
					'Built B2B LLM chatbots with multi-model pipelines and prompt engineering, and shipped responsive React apps.',
				],
			},
		],
	},
	{
		company: 'Rogers Communications',
		location: 'Toronto, Ontario',
		roles: [
			{
				title: 'Software Engineer Intern',
				period: 'Summer 2022 & Summer 2023',
				points: [
					'Built React.js and Leaflet.js mapping tools visualizing millions of network points of interest, improving technician workflows by 50%.',
					'Designed a topology-mapping system and search algorithm (React.js, SQL) automating service-area planning across thousands of sites.',
					'Wrote Spring Boot REST APIs powering those planning tools and streamlining field-technician data entry.',
				],
			},
		],
	},
];

export const skillGroups: SkillGroup[] = [
	{
		label: 'Languages',
		items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Solidity', 'Move (Sui)'],
	},
	{
		label: 'AI / LLM',
		items: [
			'LLM application development',
			'RAG',
			'AI agents',
			'Computer vision (OpenCV)',
			'Prompt engineering',
		],
	},
	{
		label: 'Frontend & Mobile',
		items: ['React', 'Next.js', 'Flutter', 'Tailwind CSS', 'Framer Motion', 'Three.js / WebGL'],
	},
	{
		label: 'Cloud & Data',
		items: ['GCP', 'BigQuery', 'Pulumi (IaC)', 'AWS', 'Docker', 'ETL / data pipelines'],
	},
	{
		label: 'Backend',
		items: ['Node.js', '.NET', 'GraphQL', 'REST', 'Spring Boot', 'Salesforce'],
	},
];

export const education: EducationEntry = {
	school: 'University of Guelph',
	location: 'Guelph, Ontario',
	credential: 'B.Eng. Electrical and Computer Engineering',
	year: '2026',
};
