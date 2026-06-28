export type PortfolioCategory = 'design' | 'software' | 'hardware';
export type PortfolioProjectTier = 'featured' | 'supporting';

export interface PortfolioLink {
	href: string;
	label: string;
	external?: boolean;
	download?: boolean;
}

export interface PortfolioEvidence {
	role: string;
	problem: string;
	ownership: string;
	outcome: string;
	artifact: string;
}

export interface PortfolioMedia {
	type: 'image' | 'video';
	src: string;
	label: string;
	caption?: string;
	poster?: string;
	layout?: 'full' | 'half';
	fit?: 'cover' | 'contain';
}

export interface PortfolioProject {
	slug: string;
	title: string;
	eyebrow: string;
	summary: string;
	sectionTitle: string;
	points: string[];
	stack: string[];
	categories: PortfolioCategory[];
	links: PortfolioLink[];
	evidence: PortfolioEvidence;
	media?: PortfolioMedia[];
	featured?: boolean;
	featuredSummary?: string;
	note?: string;
}

export interface PortfolioDownload {
	title: string;
	description: string;
	fileType: 'PDF' | 'ZIP' | 'DOCX';
	href: string;
}

export interface PortfolioTrack {
	slug: PortfolioCategory;
	label: string;
	href: string;
	landingDescription: string;
	pageEyebrow: string;
	pageTitle: string;
	pageDescription: string;
	introMessages: string[];
}

export interface PortfolioTrackProject {
	slug: string;
	tier: PortfolioProjectTier;
	summary: string;
	problem?: string;
	shipped?: string;
}

export const portfolioProjects: PortfolioProject[] = [
	{
		slug: 'karrier-one-main-site',
		title: 'Karrier One Main Site',
		eyebrow: 'Branding & design system',
		summary:
			"Karrier One's public site. I built the branding and the design system, then the front-end and layout, all to get a telecom and crypto product across to people who'd never seen either before.",
		sectionTitle: 'What I did',
		points: [
			'Built the Karrier One brand and a design system, so the visual language stayed consistent across the site and into the rest of the product.',
			'Put the page in a clear order. What it is at the top, then identity, the products, then the calls to action.',
			'Used big imagery and a steady, consistent layout so it read as credible without getting vague.',
			'Built the front-end so the shipped site matched the design.',
		],
		stack: ['Figma', 'Branding', 'Design systems', 'React', 'Webflow', 'Landing page UX'],
		categories: ['design'],
		featured: true,
		featuredSummary:
			"Karrier One's public site. I did the branding, the design system, and the front-end to make a dense telecom and crypto product easy to follow.",
		links: [{label: 'Visit karrier.one', href: 'https://www.karrier.one/', external: true}],
		evidence: {
			role: 'Brand, design system, and front-end on the public site.',
			problem:
				"Karrier One mixes telecom, digital identity, and crypto. That's a lot to land with someone who's never seen any of it.",
			ownership:
				'I built the brand and design system, the page structure, and the front-end, and kept everything consistent from the hero down into the deeper sections.',
			outcome:
				"When I started, Karrier One had a weak brand and a website that barely converted. I designed the whole brand and rebuilt the site around it, and it turned into something credible: the first thing partners and new users get pointed to.",
			artifact: 'The live site, a hero capture, and a short screen recording of it in use.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/karrier-one-hero.jpg',
				label: 'The Karrier One landing hero on the live site.',
				caption: 'The hero on the live site.',
			},
			{
				type: 'video',
				src: '/projects/karrier-one-walkthrough.mp4',
				poster: '/projects/karrier-one-hero.jpg',
				label: 'Screen recording of the Karrier One site.',
				caption: 'A short screen recording of the live site.',
			},
		],
		note: 'Live capture from karrier.one.',
	},
	{
		slug: 'karrier-foundation',
		title: 'Karrier Foundation',
		eyebrow: 'Mission site',
		summary:
			'The foundation side of Karrier One. Same ecosystem, but this one was about the mission, so it needed a calmer, more human tone than the product site.',
		sectionTitle: 'What I did',
		points: [
			'Led with the mission and kept the navigation and pacing quiet, so the first impression felt human instead of crypto-heavy.',
			'Used a softer hero and lighter type to match the idea of connectivity as access, not a sales pitch.',
			'Built and shipped the front-end.',
		],
		stack: ['Figma', 'Content strategy', 'Visual design', 'Responsive web'],
		categories: ['design'],
		links: [{label: 'Visit karrier.foundation', href: 'https://karrier.foundation/', external: true}],
		evidence: {
			role: 'Designer and front-end on the foundation site.',
			problem:
				'It needed to read as a real public-interest effort, not a corporate microsite or another crypto landing page.',
			ownership: 'I focused on the tone, the messaging, and a calmer, more editorial layout.',
			outcome:
				'It positioned the foundation as a serious effort around connectivity access, with a more trustworthy feel than a typical product page.',
			artifact: 'The live site, a hero capture, and a short screen recording.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/karrier-foundation-hero.jpg',
				label: 'The Karrier Foundation hero on the live site.',
				caption: 'The hero on the live foundation site.',
			},
			{
				type: 'video',
				src: '/projects/karrier-foundation-walkthrough.mp4',
				poster: '/projects/karrier-foundation-hero.jpg',
				label: 'Screen recording of the Karrier Foundation site.',
				caption: 'A short screen recording of the live site.',
			},
		],
		note: 'Live capture from karrier.foundation.',
	},
	{
		slug: 'karrier-dashboard',
		title: 'Karrier One Dashboard',
		eyebrow: 'Logged-in product',
		summary:
			'The dashboard behind Karrier One. Identity, KYC, phone numbers, services, and on-network actions all live in one logged-in product.',
		sectionTitle: 'What I did',
		points: [
			'The hard part was mixing crypto mechanics with normal web app flows, so people could finish high-friction tasks without getting lost.',
			'Main surfaces: identity verification, account setup, service config, and the operational actions around the hardware and rewards.',
			'Treated it as a UX and a systems problem. The interface had to stay simple while still exposing real operational detail.',
		],
		stack: ['TypeScript', 'React', '.NET', 'System design', 'Design systems'],
		categories: ['design', 'software'],
		featured: true,
		featuredSummary:
			'The logged-in product behind Karrier One. I worked the design and front-end for identity, service setup, and day-to-day operations.',
		links: [
			{label: 'Open dashboard', href: 'https://dashboard.karrier.one/', external: true},
			{
				label: 'View dashboard guide',
				href: 'https://docs.karrier.one/karrier-number-system/user-guide/completing-kyc-verification',
				external: true,
			},
		],
		evidence: {
			role: 'Product lead, designer, and engineer on the logged-in product.',
			problem:
				'People needed to get through identity, KYC, service, and network actions without drowning in crypto complexity.',
			ownership:
				'I drove the UX direction and product structure for flows that had to feel simple but still reflect the real telecom and operational constraints.',
			outcome:
				'It ran real-time device analytics and revenue across thousands of nodes worldwide, tied to product work behind over $2.1M in on-chain revenue.',
			artifact: 'The live dashboard, the docs-backed KYC flow, and the screens below.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/karrier-dashboard-home.jpg',
				label: 'The Karrier One dashboard home screen.',
				caption: 'The dashboard home: revenue by device, venue health, client activity, and issues.',
				layout: 'half',
				fit: 'contain',
			},
			{
				type: 'image',
				src: '/projects/karrier-dashboard-kns.jpg',
				label: 'The Karrier One KNS dashboard view.',
				caption: 'The KNS view: number services, identity, asset management, and Karrier Pay.',
				layout: 'half',
				fit: 'contain',
			},
		],
	},
	{
		slug: 'llm-assembly-platform',
		title: 'LLM-Powered Assembly Guidance Platform',
		eyebrow: 'Capstone',
		summary:
			"My capstone. It takes a technical PDF and turns it into step-by-step assembly instructions, adapted to whoever's following along and cited back to the source. It runs on a RAG pipeline, with computer vision tracking your progress as you build.",
		sectionTitle: 'What I did',
		points: [
			'I was the technical lead. The system reads a PDF and generates persona-adapted, step-by-step guidance through a retrieval-augmented LLM pipeline, with every step linked back to the source.',
			'Built the full TypeScript and React front-end, plus a Python and OpenCV piece that tracks real assembly progress from a live camera.',
			'Added a text-to-speech mode for when your hands are busy. It cut assembly time in user testing.',
		],
		stack: ['TypeScript', 'React', 'Python', 'OpenCV', 'RAG'],
		categories: ['software'],
		featured: true,
		featuredSummary:
			'My capstone. Reads a technical PDF and turns it into adapted, step-by-step assembly instructions with cited sources and live camera tracking.',
		links: [
			{
				label: 'Open live demo',
				href: 'https://frontend-six-teal.vercel.app/',
				external: true,
			},
			{
				label: 'Download capstone proposal',
				href: '/projects/llm-assembly-capstone-proposal.docx',
				download: true,
			},
		],
		evidence: {
			role: 'Technical lead on a four-person team. Owned product definition, the TypeScript and React front-end, and the Python and OpenCV piece.',
			problem:
				"Static manuals are hard to follow, can't adapt to the person reading them, and don't help when you get stuck mid-task.",
			ownership:
				'I led the team and built the front-end and the camera-tracking subsystem, and tied PDF parsing, retrieval, the adapted guidance, and live tracking into one flow.',
			outcome:
				'We shipped a live prototype: PDF in, cited steps out, progress tracking, camera-assisted checks, and a hands-free voice mode. In showcase testing it dropped assembly time from 121 s to 109.5 s (9.05%) and reached a SUS score of 78 out of 100.',
			artifact: 'The live demo, the proposal report, and the poster from the University of Guelph showcase.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/capstone-homepage.jpg',
				label: 'The homepage of the live assembly platform.',
				caption: 'The homepage of the live product.',
			},
			{
				type: 'image',
				src: '/projects/capstone-showcase-photo-upright.jpg',
				label: 'Cole Mayke and the capstone team presenting at the University of Guelph showcase.',
				caption: 'Our team presenting at the Guelph engineering showcase.',
				layout: 'half',
			},
			{
				type: 'image',
				src: '/projects/capstone-poster.png',
				label: 'The capstone poster.',
				caption: 'The capstone poster: the workflow, the computer-vision checks, and the time result.',
				layout: 'half',
			},
		],
	},
	{
		slug: 'ecg-front-end',
		title: 'Mixed-Signal ECG Front-End IC',
		eyebrow: 'Mixed-signal IC',
		summary:
			'A smartwatch ECG front-end in TSMC 65 nm. A 3:1 CMOS mux, a switched-cap PGA, and a 6-bit SAR ADC, all running on a 1 V supply.',
		sectionTitle: 'What I did',
		points: [
			'Designed to a real smartwatch spec: 1 V supply, 20 mV max ECG amplitude, 10 kΩ source, low power, on TSMC 65 nm.',
			'Built the whole analog path: the 3:1 mux, the switched-cap PGA with gains of 1 to 4, a two-stage op-amp, and a 6-bit SAR ADC with Verilog-A control.',
			'Verified it at block and top level with DC, AC, and transient sims, then wrote it up as the full ENGG 4080 report.',
		],
		stack: ['Cadence Virtuoso', 'Spectre', 'Verilog-A', 'Mixed-signal simulation'],
		categories: ['hardware'],
		links: [
			{label: 'Download full project report', href: '/projects/ecg-front-end-report.pdf', download: true},
			{label: 'Download related analog lab files', href: '/labs/nano-lab1.zip', download: true},
		],
		evidence: {
			role: 'Mixed-signal designer. Owned the analog front-end, the transistor-level work, and verification.',
			problem:
				'It had to pull low-amplitude ECG signals off a 0.5 V common-mode, give programmable gain, and convert on-chip, all under a strict 1 V, low-power budget.',
			ownership:
				'I designed the mux, the switched-cap PGA, the two-stage op-amp, the comparator path, the capacitor array, and the Verilog-A SAR control.',
			outcome:
				'Hit the targets: about 40 dB op-amp gain, PGA gains of 1x to 4x within roughly 5-10% of ideal, a 6-bit ADC at 15.625 mV LSB and 105+ samples/s, and front-end power well under 100 µW.',
			artifact:
				'The full ENGG 4080 report: block diagrams, op-amp AC results, PGA waveforms, top-level ADC sims, and the Verilog-A listing.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/report-crops/ecg-pga-schematic-clean.jpg',
				label: 'The PGA schematic from the ECG front-end in Cadence.',
				caption: 'The PGA schematic in Cadence.',
				layout: 'half',
				fit: 'contain',
			},
			{
				type: 'image',
				src: '/projects/report-crops/ecg-mux-schematic-clean.jpg',
				label: 'The input mux schematic from the ECG front-end.',
				caption: 'The input mux schematic.',
				layout: 'half',
				fit: 'contain',
			},
		],
		note: 'Full report and analog lab files are linked above.',
	},
	{
		slug: 'layout-verification',
		title: 'Analog Front-End Layout & Verification',
		eyebrow: 'Physical design',
		summary:
			'Took a common-source CMOS amplifier through the full custom IC flow in TSMC 65 nm, all the way to DRC, LVS, PEX, and post-layout checks.',
		sectionTitle: 'What I did',
		points: [
			'Ran the whole Virtuoso-to-Calibre flow: schematic, symbol, testbench, layout, DRC, LVS, PEX, and post-layout sim.',
			'Used schematic-driven layout and hand place-and-route to keep wires short and parasitics down on 65 nm rules.',
			'Compared pre- and post-layout directly, treating layout as an electrical problem, not just a formality.',
		],
		stack: ['Cadence Virtuoso', 'Calibre', 'Full custom layout', 'Post-layout analysis'],
		categories: ['hardware'],
		links: [
			{
				label: 'Download layout report',
				href: '/projects/layout-verification-report.pdf',
				download: true,
			},
			{
				label: 'Download common-source lab files',
				href: '/labs/lab1-nano-common-source.zip',
				download: true,
			},
		],
		evidence: {
			role: 'Owned the layout and verification for the analog block.',
			problem:
				'Keep the amplifier behaving the same through layout while passing every foundry check and keeping routing parasitics low.',
			ownership:
				'I did the layout, the place-and-route, DRC and LVS closure, and the pre- and post-layout comparison against the original design.',
			outcome:
				'Clean DRC, a full LVS match, successful PEX, and a measured midband gain drop from about 12 V/V to 10-11 V/V post-layout as the parasitics pulled the dominant pole down.',
			artifact:
				'The full report: final layout, DRC/LVS/PEX captures, the extracted view, and pre- and post-layout AC, DC, and transient results.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/report-crops/layout-final-layout-clean.jpg',
				label: 'The final common-source amplifier layout.',
				caption: 'The final amplifier layout.',
				layout: 'half',
				fit: 'contain',
			},
			{
				type: 'image',
				src: '/projects/report-crops/layout-common-source-schematic-clean.jpg',
				label: 'The pre-layout common-source schematic.',
				caption: 'The pre-layout schematic, for reference.',
				layout: 'half',
				fit: 'contain',
			},
		],
		note: 'Full report and lab files are linked above.',
	},
	{
		slug: 'aes-soc',
		title: 'AES-128 SoC Coprocessor',
		eyebrow: 'Digital systems',
		summary:
			'A memory-mapped AES-128 coprocessor with CBC and OFB modes. Verified in simulation and checked end-to-end against NIST test vectors on real hardware.',
		sectionTitle: 'What I did',
		points: [
			'Defined the register map the programmer sees: keys, IVs, plaintext, and ciphertext over the bus.',
			'Paired the RTL with embedded C on the HPS so it acted like a real SoC peripheral, not an isolated block.',
			'Used simulation and on-hardware validation together to prove it against real cipher-mode vectors.',
		],
		stack: ['Verilog', 'SystemVerilog', 'ModelSim', 'HW/SW co-design'],
		categories: ['hardware'],
		links: [
			{
				label: 'Download related FPGA lab archive',
				href: '/labs/engg3050-lab1-update-9-final.zip',
				download: true,
			},
		],
		evidence: {
			role: 'RTL and integration on the AES coprocessor and its interface.',
			problem:
				'It needed to behave like a usable SoC peripheral, not just an RTL block, and support CBC and OFB.',
			ownership:
				'I did the RTL, the register map, the APB-style interface model, and the end-to-end validation against software and test vectors.',
			outcome:
				'Built a 16 x 32-bit register model, validated CBC and OFB against NIST 800-38A vectors, and ran it in both simulation and on DE1-SoC hardware.',
			artifact: 'A project summary and the linked digital-systems archive.',
		},
		note: 'Related lab material is linked above.',
	},
	{
		slug: 'fpga-digital-systems',
		title: 'FPGA Digital Systems Design',
		eyebrow: 'FPGA systems',
		summary:
			'DE1-SoC lab and project work: RTL modules, state machines, and memory-mapped interfaces for embedded FPGA systems.',
		sectionTitle: 'What I did',
		points: [
			'Worked across simulation and on-board validation, not just RTL on paper.',
			'Used bus interfaces and hardware/software patterns that fed straight into the later SoC work.',
			'Built up a real base in FPGA verification, register design, and embedded control.',
		],
		stack: ['Verilog', 'DE1-SoC', 'Quartus', 'Embedded systems'],
		categories: ['hardware'],
		links: [
			{
				label: 'Download embedded lab archive',
				href: '/labs/engg3640-lab-3-reset.zip',
				download: true,
			},
		],
		evidence: {
			role: 'FPGA and embedded coursework, building reusable RTL, simulation, and board-debug skills.',
			problem: 'Turn digital design concepts into modules that actually behave in simulation and on hardware.',
			ownership:
				'I designed and checked registers, state machines, and memory-mapped interfaces across Quartus, ModelSim, and the board.',
			outcome: 'This became the base for the later SoC integration and hardware/software work.',
			artifact: 'An embedded lab archive covering the same work.',
		},
		note: 'Supporting FPGA coursework is linked here.',
	},
];

export const portfolioTracks: PortfolioTrack[] = [
	{
		slug: 'design',
		label: 'Design',
		href: '/projects/design',
		landingDescription:
			'Marketing sites, dashboards, and the interface calls that make telecom and crypto products usable.',
		pageEyebrow: 'Projects / design',
		pageTitle: 'Design engineering work',
		pageDescription: 'Product framing, hierarchy, and the interface decisions that make complex systems usable.',
		introMessages: [
			'I use design to make dense technical products make sense.',
			'Mostly landing pages, dashboards, and interfaces for telecom and crypto.',
		],
	},
	{
		slug: 'software',
		label: 'Software',
		href: '/projects/software',
		landingDescription:
			'AI products, internal tooling, and full-stack systems built around how people actually work.',
		pageEyebrow: 'Projects / software',
		pageTitle: 'Software engineering work',
		pageDescription:
			'Application logic, system behavior, product flows, and the front-end and back-end glue between them.',
		introMessages: [
			'I build products where the front-end and the system behind it have to work as one.',
			'Mostly AI products, internal tooling, and full-stack work.',
		],
	},
	{
		slug: 'hardware',
		label: 'Hardware',
		href: '/projects/hardware',
		landingDescription:
			'Mixed-signal IC design, custom layout and verification, RTL, and FPGA systems.',
		pageEyebrow: 'Projects / hardware',
		pageTitle: 'Hardware engineering work',
		pageDescription:
			'The semiconductor and digital-systems side, from analog blocks through verification and hardware/software integration.',
		introMessages: [
			'My hardware work runs from mixed-signal IC design to physical verification, RTL, and FPGA systems.',
			'These are about architecture, simulation, and verification.',
		],
	},
];

export const portfolioTrackProjects: Record<PortfolioCategory, PortfolioTrackProject[]> = {
	design: [
		{
			slug: 'karrier-one-main-site',
			tier: 'featured',
			summary:
				'The Karrier One brand, design system, and public site, built to explain decentralized telecom without burying a first-time visitor.',
		},
		{
			slug: 'karrier-dashboard',
			tier: 'featured',
			summary: 'The logged-in product for identity, KYC, services, numbers, and network actions.',
		},
		{
			slug: 'karrier-foundation',
			tier: 'supporting',
			summary: 'The foundation site, framing decentralized connectivity as access rather than a product pitch.',
		},
	],
	software: [
		{
			slug: 'llm-assembly-platform',
			tier: 'featured',
			summary:
				'Turns technical PDFs into adapted, step-by-step assembly instructions using RAG, with computer-vision progress tracking.',
		},
		{
			slug: 'karrier-dashboard',
			tier: 'featured',
			summary:
				'A TypeScript-heavy product tying identity, services, analytics, and telecom operations into one logged-in system.',
		},
	],
	hardware: [
		{
			slug: 'ecg-front-end',
			tier: 'featured',
			summary:
				'A smartwatch ECG front-end: analog acquisition, programmable gain, and SAR conversion on a 1 V supply.',
		},
		{
			slug: 'layout-verification',
			tier: 'featured',
			summary: 'A full custom layout and verification pass for an analog amplifier in TSMC 65 nm.',
		},
		{
			slug: 'aes-soc',
			tier: 'supporting',
			summary: 'A memory-mapped AES-128 coprocessor checked against NIST vectors in simulation and on hardware.',
		},
		{
			slug: 'fpga-digital-systems',
			tier: 'supporting',
			summary:
				'FPGA and embedded work: RTL, memory-mapped interfaces, simulation, and board-level validation on DE1-SoC.',
		},
	],
};

// Explicit homepage ordering: lead with work that proves systems plus design,
// then at most one marketing site. Only projects still flagged `featured` show.
const featuredOrder = ['karrier-dashboard', 'llm-assembly-platform', 'karrier-one-main-site'];

export const featuredPortfolioProjects = featuredOrder
	.map(slug => portfolioProjects.find(project => project.slug === slug))
	.filter((project): project is PortfolioProject => Boolean(project?.featured));

export const portfolioDownloads: PortfolioDownload[] = [
	{
		title: 'ENGG 4080 ECG Front-End Report',
		description:
			'Full mixed-signal project report covering the 3:1 mux, switched-cap PGA, op-amp, SAR ADC, and top-level results.',
		fileType: 'PDF',
		href: '/projects/ecg-front-end-report.pdf',
	},
	{
		title: 'ENGG 4080 Layout Verification Report',
		description:
			'Full layout and verification report covering DRC, LVS, PEX, and post-layout simulation of a common-source amplifier.',
		fileType: 'PDF',
		href: '/projects/layout-verification-report.pdf',
	},
	{
		title: 'ENGG 3450 Lab 1 Report',
		description: 'Electronic devices lab report covering diode characterization, LEDs, and a half-wave rectifier.',
		fileType: 'PDF',
		href: '/labs/engg3450-lab-1.pdf',
	},
	{
		title: 'ENGG 3450 Lab 3 Report',
		description: 'Electronic devices lab report covering inverter VTC, propagation delay, ring oscillators, and logic gates.',
		fileType: 'PDF',
		href: '/labs/engg3450-lab-3.pdf',
	},
	{
		title: 'Nano Lab 1 Data Pack',
		description: 'Supporting plots and CSV exports from analog transistor and device characterization work.',
		fileType: 'ZIP',
		href: '/labs/nano-lab1.zip',
	},
	{
		title: 'Common-Source Lab Files',
		description: 'Supporting files for the common-source analog design and analysis work.',
		fileType: 'ZIP',
		href: '/labs/lab1-nano-common-source.zip',
	},
	{
		title: 'ENGG 3050 FPGA Archive',
		description: 'Digital systems and FPGA coursework archive for related lab work.',
		fileType: 'ZIP',
		href: '/labs/engg3050-lab1-update-9-final.zip',
	},
	{
		title: 'ENGG 3640 Embedded Archive',
		description: 'Embedded systems lab archive with supporting source files and build outputs.',
		fileType: 'ZIP',
		href: '/labs/engg3640-lab-3-reset.zip',
	},
];

export const portfolioProjectMap = Object.fromEntries(
	portfolioProjects.map(project => [project.slug, project]),
) as Record<string, PortfolioProject>;

export function getPortfolioProject(slug: string) {
	return portfolioProjectMap[slug];
}

export function getPortfolioTrack(category: PortfolioCategory) {
	return portfolioTracks.find(track => track.slug === category);
}

export function getTrackProjects(category: PortfolioCategory) {
	return portfolioTrackProjects[category]
		.map(trackProject => {
			const project = getPortfolioProject(trackProject.slug);

			if (!project) {
				return null;
			}

			return {
				project,
				trackProject,
			};
		})
		.filter(Boolean) as Array<{project: PortfolioProject; trackProject: PortfolioTrackProject}>;
}

export function getCaseStudyHref(slug: string) {
	return `/projects/${slug}`;
}
