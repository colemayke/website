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
	evidenceToAdd?: string[];
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
		eyebrow: 'product design / marketing site',
		summary:
			'I worked on the public-facing Karrier One site as a product translation layer, shaping a landing experience that makes telecom infrastructure, digital identity, and decentralized connectivity feel legible in a few scrolls.',
		sectionTitle: 'recruiter case study',
		points: [
			'Worked to simplify a dense telecom + web3 story into a cleaner narrative arc: hero promise first, then identity, solutions, and conversion-focused calls to action.',
			'Balanced atmosphere and usability through large-format imagery, stable navigation, and clearer section rhythm so the site could feel premium without becoming vague.',
			'The embedded hero capture and walkthrough turn this from a resume bullet into shipped evidence from the live production experience.',
		],
		stack: ['Figma', 'React', 'Webflow', 'design systems', 'landing page UX'],
		categories: ['design'],
		links: [{label: 'visit karrier.one', href: 'https://www.karrier.one/', external: true}],
		evidence: {
			role: 'software engineer and product-minded designer working on the public-facing Karrier One experience.',
			problem:
				'The platform combined telecom infrastructure, digital identity, and web3 mechanics, which made the story easy to overcomplicate for first-time visitors.',
			ownership:
				'I helped shape the page hierarchy, front-end implementation, and design-system consistency so the story stayed understandable as users moved from the hero into deeper product sections.',
			outcome:
				'The site became a stronger partner-facing entry point for onboarding and business conversations, with a clearer bridge between brand, product value, and the technical ecosystem underneath it.',
			artifact:
				'Live site, production hero capture, and a short walkthrough clip recorded from the shipped experience.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/karrier-one-hero.jpg',
				label: 'Karrier One landing-page hero with the Connectivity without Borders headline, city backdrop, and primary call to action.',
				caption:
					'Production hero section from the live site, showing the borderless-connectivity framing, persistent nav, and direct CTA treatment.',
			},
			{
				type: 'video',
				src: '/projects/karrier-one-walkthrough.mp4',
				poster: '/projects/karrier-one-hero.jpg',
				label: 'Screen-recorded walkthrough of the Karrier One website showing how the story flows from the hero into deeper product sections.',
				caption:
					'Short walkthrough of the live site that shows the actual pacing, motion, and narrative transition into the digital-identity and solutions sections.',
			},
		],
		note: 'Live production capture from karrier.one.',
	},
	{
		slug: 'karrier-foundation',
		title: 'Karrier Foundation',
		eyebrow: 'mission-driven design',
		summary:
			'This site focused on the mission-facing side of the ecosystem, turning decentralized telecom infrastructure into a calmer public-interest narrative about access, dignity, and underserved communities.',
		sectionTitle: 'recruiter case study',
		points: [
			'Reframed the story around a strong mission headline, quieter navigation, and softer visual pacing so the first impression felt civic and human instead of crypto-native.',
			'Used an atmospheric hero, restrained interaction design, and lighter typography treatment to support the idea of connectivity as a human right rather than a pure product pitch.',
			'The screenshot and walkthrough turn this into concrete shipped evidence of mission-led interface work rather than just a design description.',
		],
		stack: ['Figma', 'content strategy', 'visual design', 'responsive web'],
		categories: ['design'],
		links: [{label: 'visit karrier.foundation', href: 'https://karrier.foundation/', external: true}],
		evidence: {
			role: 'designer and front-end contributor shaping the foundation-facing storytelling layer of the ecosystem.',
			problem:
				'The foundation needed to communicate a credible public-interest mission without feeling vague, overly corporate, or crypto-native in the wrong way.',
			ownership:
				'I focused on translating a technical mission into a calmer, more editorial web experience with clearer messaging, softer visual direction, and more accessible narrative pacing.',
			outcome:
				'The work positioned the foundation as a serious initiative around connectivity access instead of just another ecosystem microsite, using a more trust-building visual language and less transactional product framing.',
			artifact:
				'Live site, hero capture, and a recorded walkthrough showing how the mission-led story unfolds through the shipped interface.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/karrier-foundation-hero.jpg',
				label: 'Karrier Foundation landing-page hero showing the Turning connectivity into a human right message and the calmer editorial visual direction.',
				caption:
					'Production hero section from the live Foundation site, showing the mission-first headline, soft atmospheric backdrop, and restrained navigation.',
			},
			{
				type: 'video',
				src: '/projects/karrier-foundation-walkthrough.mp4',
				poster: '/projects/karrier-foundation-hero.jpg',
				label: 'Screen-recorded walkthrough of the Karrier Foundation website showing the landing flow and mission-led pacing.',
				caption:
					'Short walkthrough of the live site that shows the actual visual pacing, transitions, and how the narrative moves beyond the opening hero.',
			},
		],
		note: 'Live production capture from karrier.foundation.',
	},
	{
		slug: 'karrier-dashboard',
		title: 'Karrier One Dashboard',
		eyebrow: 'software product / product design',
		summary:
			'The dashboard is the operational layer behind Karrier One: identity, KYC, numbers, services, and deployment actions all meet in one logged-in product surface.',
		sectionTitle: 'what mattered',
		points: [
			'The main design problem was blending web3 mechanics with familiar web2 product flows so users could complete high-friction tasks without feeling lost.',
			'Key product surfaces include identity verification, account setup, service configuration, and operational actions around telecom hardware and rewards.',
			'I treated this as both a UX and systems problem: the UI had to feel simple while still exposing real operational complexity.',
		],
		stack: ['TypeScript', 'React', 'dashboard UX', 'identity flows', 'design systems'],
		categories: ['design', 'software'],
		featured: true,
		featuredSummary:
			'product and front-end work across a telecom + web3 dashboard used for identity, service setup, and operational actions.',
		links: [
			{label: 'open dashboard', href: 'https://dashboard.karrier.one/', external: true},
			{
				label: 'view dashboard guide',
				href: 'https://docs.karrier.one/karrier-number-system/user-guide/completing-kyc-verification',
				external: true,
			},
		],
		evidence: {
			role: 'product lead, designer, and engineer on the logged-in operational product experience.',
			problem:
				'Users needed to move through identity, KYC, service, and network actions without getting buried under web3 complexity.',
			ownership:
				'I worked on the UX direction and product structure for flows that needed to feel simple while still reflecting real operational and telecom constraints.',
			outcome:
				'The dashboard supported real-time device analytics and revenue views across thousands of global nodes while aligning with product priorities tied to over $2.1M in cumulative on-chain revenue.',
			artifact:
				'Live dashboard, docs-backed KYC flow, and a product case study that speaks to UX, systems thinking, and operational tooling.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/karrier-dashboard-home.jpg',
				label: 'Karrier One dashboard home screen showing device revenue, venue health, client activity, and issue monitoring in the logged-in product.',
				caption:
					'Dashboard home view covering revenue by device, venue operations, client activity, and issue monitoring inside the Karrier One product.',
				layout: 'half',
				fit: 'contain',
			},
			{
				type: 'image',
				src: '/projects/karrier-dashboard-kns.jpg',
				label: 'Karrier One KNS dashboard view showing number services, digital identity settings, asset management, and Karrier Pay flows.',
				caption:
					'KNS dashboard view covering number services, NFT identity, asset management, and Karrier Pay inside the same product system.',
				layout: 'half',
				fit: 'contain',
			},
		],
		evidenceToAdd: [
			'dashboard screenshots of analytics, KYC, and service setup',
			'one or two user-flow diagrams',
			'short explanation of what you personally shipped end-to-end',
		],
	},
	{
		slug: 'llm-assembly-guide',
		title: 'LLM-Based Automated Assembly Guide',
		eyebrow: 'software engineering / capstone',
		summary:
			'My capstone project turns assembly PDFs into persona-aware step-by-step instructions, combining structured planning, interactive guidance, computer vision, and a polished product interface.',
		sectionTitle: 'recruiter case study',
		points: [
			'Framed the product around a simple loop: upload a manual, extract cited steps, assemble in a model-first interface, and verify progress without leaving the workflow.',
			'Built the software/UI side around Next.js, timeline navigation, inline PDF context, chat-style clarification, and a landing experience designed to feel like a high-trust product rather than a school demo.',
			'Connected the experience to live camera support, progress tracking, computer-vision-assisted verification, and persona-aware instruction generation for novice through expert users.',
		],
		stack: ['Next.js', 'FastAPI', 'OpenAI', 'computer vision', 'product prototyping'],
		categories: ['software'],
		featured: true,
		featuredSummary:
			'a capstone product that converts assembly PDFs into adaptive instructions using AI, computer vision, and a guided front-end.',
		links: [
			{
				label: 'open live demo',
				href: 'https://frontend-six-teal.vercel.app/',
				external: true,
			},
			{
				label: 'download capstone proposal',
				href: '/projects/llm-assembly-capstone-proposal.docx',
				download: true,
			},
		],
		evidence: {
			role: 'software/UI lead on a four-person capstone team, contributing to product definition, system architecture, and the user-facing assembly workflow.',
			problem:
				'Static manuals are hard to follow, difficult to personalize, and weak at handling real-time confusion, task state, and step-by-step context.',
			ownership:
				'I drove the product-facing web experience and helped shape how PDF parsing, structured planning, persona-aware guidance, and live assistance fit into one coherent flow.',
			outcome:
				'Shipped a live prototype that takes PDF input and turns it into cited steps, 3D-first navigation, chat assistance, progress gating, and camera-assisted validation. In showcase testing, the system reduced assembly completion time from 121 s to 109.5 s, a 9.05% improvement, and reached an illustrative SUS score of 78/100.',
			artifact:
				'Live Vercel demo, capstone proposal report, and a poster-backed showcase presentation from the University of Guelph capstone showcase.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/capstone-homepage.jpg',
				label: 'Homepage of the live LLM Assembly Instruction Platform showing the product framing, assembly workflow, and guided interface.',
				caption:
					'Homepage of the capstone product, designed around PDF-grounded instructions, 3D-guided assembly, and step-by-step workflow control.',
			},
			{
				type: 'image',
				src: '/projects/capstone-showcase-photo-upright.jpg',
				label: 'Cole Mayke and the LLM Assembly Instruction Platform capstone team presenting their poster at the University of Guelph engineering showcase.',
				caption:
					'University of Guelph capstone showcase presentation with the project team, poster, and faculty advisor.',
				layout: 'half',
			},
			{
				type: 'image',
				src: '/projects/capstone-poster.png',
				label: 'Capstone poster for the LLM Assembly Instruction Platform highlighting the workflow, computer-vision support, and measured results.',
				caption:
					'Poster summarizing the system workflow, computer-vision-assisted assembly validation, and the 121 s to 109.5 s completion-time improvement shown during the showcase.',
				layout: 'half',
			},
		],
	},
	{
		slug: 'ecg-front-end',
		title: 'Mixed-Signal ECG Front-End IC',
		eyebrow: 'electrical engineering / mixed-signal ic design',
		summary:
			'I designed a smartwatch-oriented ECG front-end in TSMC 65 nm that combined a 3:1 CMOS mux, switched-cap PGA, and 6-bit SAR ADC under a 1 V supply.',
		sectionTitle: 'recruiter case study',
		points: [
			'Designed around a realistic smartwatch constraint set: 1 V battery supply, 20 mV maximum ECG amplitude, 10 kΩ source resistance, and low-power operation on TSMC 65 nm CMOS.',
			'Integrated the analog path end-to-end, including the 3:1 mux, switched-cap PGA with gains of 1 through 4, a two-stage CMOS op-amp, and a 6-bit SAR ADC with Verilog-A control logic.',
			'Verified the chain at block and top level using DC, AC, and transient simulation, then documented the design as a full ENGG 4080 mixed-signal project report.',
		],
		stack: ['Cadence Virtuoso', 'Spectre', 'Verilog-A', 'mixed-signal simulation'],
		categories: ['hardware'],
		featured: true,
		featuredSummary:
			'a mixed-signal IC project that ties together analog blocks, ADC design, and full-system simulation under a 1 V supply.',
		links: [
			{label: 'download full project report', href: '/projects/ecg-front-end-report.pdf', download: true},
			{label: 'download related analog lab files', href: '/labs/nano-lab1.zip', download: true},
		],
		evidence: {
			role: 'mixed-signal designer responsible for the analog front-end architecture, transistor-level implementation, and simulation/verification path.',
			problem:
				'The design had to resolve low-amplitude ECG signals around a 0.5 V common-mode level, provide programmable gain, and convert the output on-chip under a strict 1 V supply and low-power budget.',
			ownership:
				'I designed the mux, the switched-cap PGA, the two-stage op-amp, the comparator path, the binary-weighted capacitor array, and the Verilog-A SAR control used to drive conversion.',
			outcome:
				'The design met the main project targets: about 40 dB open-loop op-amp gain, measured PGA gains of 1x to 4x within roughly 5-10% of ideal, a 6-bit ADC with 15.625 mV LSB and at least 105 samples/s, and expected analog front-end power well below 100 µW.',
			artifact:
				'Full ENGG 4080 report with block diagrams, op-amp AC results, PGA gain stepping waveforms, top-level ADC simulation, and the Verilog-A SAR listing.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/report-crops/ecg-pga-schematic-clean.jpg',
				label: 'Cadence Virtuoso PGA schematic from the mixed-signal ECG front-end showing the switched-capacitor gain path and supporting circuitry.',
				caption:
					'Cadence PGA schematic from the ECG front-end, used as the lead artifact for the project because it shows the core gain stage and mixed-signal integration work directly.',
				layout: 'half',
				fit: 'contain',
			},
			{
				type: 'image',
				src: '/projects/report-crops/ecg-mux-schematic-clean.jpg',
				label: 'Cadence Virtuoso MUX schematic from the ECG front-end showing the transmission-gate input selection network.',
				caption:
					'MUX schematic from the same ECG front-end, showing the input-selection path that feeds the downstream PGA and ADC chain.',
				layout: 'half',
				fit: 'contain',
			},
		],
		note: 'Full mixed-signal report and related analog lab files are available above.',
	},
	{
		slug: 'layout-verification',
		title: 'Analog Front-End Layout & Verification',
		eyebrow: 'electrical engineering / physical design',
		summary:
			'I took a common-source CMOS amplifier through the full custom IC flow, ending with DRC, LVS, PEX, and post-layout validation in TSMC 65 nm.',
		sectionTitle: 'recruiter case study',
		points: [
			'Executed the complete Virtuoso-to-Calibre flow: schematic capture, symbol generation, testbenching, layout drafting, DRC, LVS, PEX, and post-layout simulation.',
			'Used schematic-driven layout plus manual place-and-route to keep interconnect short and parasitics controlled on TSMC 65 nm design rules.',
			'Compared pre- and post-layout behaviour directly, treating layout as an electrical design problem rather than a final documentation step.',
		],
		stack: ['Cadence Virtuoso', 'Calibre', 'full custom layout', 'post-layout analysis'],
		categories: ['hardware'],
		links: [
			{
				label: 'download layout report',
				href: '/projects/layout-verification-report.pdf',
				download: true,
			},
			{
				label: 'download common-source lab files',
				href: '/labs/lab1-nano-common-source.zip',
				download: true,
			},
		],
		evidence: {
			role: 'physical design and verification owner for the analog block layout and post-layout checks.',
			problem:
				'The challenge was to preserve amplifier behaviour through layout while staying clean on all foundry checks and minimizing routing parasitics.',
			ownership:
				'I handled schematic-driven layout, manual place-and-route, DRC/LVS closure, and post-layout comparison against the original design intent.',
			outcome:
				'Closed DRC with no true rule violations, passed LVS with a full match, completed PEX successfully, and measured the midband gain drop from about 12 V/V pre-layout to about 10-11 V/V post-layout as the extracted parasitics shifted the dominant pole lower.',
			artifact:
				'Full layout-verification report with final layout captures, DRC/LVS/PEX screenshots, extracted-view confirmation, and pre/post-layout AC, DC, and transient results.',
		},
		media: [
			{
				type: 'image',
				src: '/projects/report-crops/layout-final-layout-clean.jpg',
				label: 'Cadence layout of the common-source amplifier showing final placement and routing before post-layout verification.',
				caption:
					'Final common-source amplifier layout captured from the layout-verification flow, used here as the lead artifact instead of the report cover.',
				layout: 'half',
				fit: 'contain',
			},
			{
				type: 'image',
				src: '/projects/report-crops/layout-common-source-schematic-clean.jpg',
				label: 'Common-source amplifier schematic used as the pre-layout reference before DRC, LVS, PEX, and post-layout analysis.',
				caption:
					'Pre-layout common-source schematic paired with the final layout so the case study shows both the original circuit intent and the physical implementation.',
				layout: 'half',
				fit: 'contain',
			},
		],
		note: 'Full layout report and supporting common-source files are available above.',
	},
	{
		slug: 'aes-soc',
		title: 'AES-128 SoC Coprocessor',
		eyebrow: 'electrical engineering / digital systems',
		summary:
			'I built a memory-mapped AES-128 coprocessor with CBC and OFB support, verified it in simulation, and validated the HW/SW path against NIST test vectors.',
		sectionTitle: 'highlights',
		points: [
			'Defined a programmer-facing register map for keys, IVs, plaintext, and ciphertext transfer across the bus interface.',
			'Paired the RTL with embedded C running on the HPS so the project behaved like a usable SoC peripheral instead of an isolated block.',
			'Used simulation and hardware validation together to prove the design against real cipher-mode test vectors.',
		],
		stack: ['Verilog', 'SystemVerilog', 'ModelSim', 'HW/SW co-design'],
		categories: ['hardware'],
		featured: true,
		featuredSummary:
			'a hardware-security and SoC integration project built around RTL design, memory-mapped interfaces, and HW/SW verification.',
		links: [
			{
				label: 'download related FPGA lab archive',
				href: '/labs/engg3050-lab1-update-9-final.zip',
				download: true,
			},
		],
		evidence: {
			role: 'RTL and integration designer for the AES coprocessor and its programmer-facing SoC interface.',
			problem:
				'The coprocessor needed to behave like a usable SoC peripheral, not just a standalone RTL block, while supporting CBC and OFB verification flows.',
			ownership:
				'I handled the RTL path, register-map thinking, the APB-style interface model, and end-to-end validation against embedded software and test vectors.',
			outcome:
				'Implemented a 16 x 32-bit register model, validated CBC and OFB operation against NIST 800-38A vectors, and exercised the design through both simulation and DE1-SoC hardware.',
			artifact:
				'Good proof here would be a register-map diagram, ModelSim waveform, and a short note showing the NIST vector pass results.',
		},
		evidenceToAdd: [
			'register-map screenshot or table',
			'ModelSim waveform of one encrypt/decrypt transaction',
			'image of the design running on hardware',
		],
		note: 'Related digital-design lab material is linked here while the dedicated AES write-up is being added.',
	},
	{
		slug: 'fpga-digital-systems',
		title: 'FPGA Digital Systems Design',
		eyebrow: 'electrical engineering / fpga systems',
		summary:
			'I used DE1-SoC-based labs and project work to design and validate RTL modules, state machines, and memory-mapped interfaces for embedded FPGA systems.',
		sectionTitle: 'highlights',
		points: [
			'Worked across simulation and board-level validation rather than stopping at RTL-only design.',
			'Used bus-oriented interfaces and hardware/software integration patterns that fed directly into later SoC work.',
			'Built up a practical base in FPGA verification, register design, and embedded control flow.',
		],
		stack: ['Verilog', 'DE1-SoC', 'Quartus', 'embedded systems'],
		categories: ['hardware'],
		links: [
			{
				label: 'download embedded lab archive',
				href: '/labs/engg3640-lab-3-reset.zip',
				download: true,
			},
		],
		evidence: {
			role: 'FPGA and embedded-systems student building up reusable RTL, simulation, and board-debug skills.',
			problem:
				'The work focused on turning digital design concepts into reliable modules that behave correctly in simulation and on hardware.',
			ownership:
				'I designed and validated registers, state machines, and memory-mapped interfaces while working across Quartus, ModelSim, and board-level testing.',
			outcome:
				'This work became the practical foundation for later SoC integration, verification, and hardware/software co-design projects.',
			artifact:
				'The best support material is a compact lab summary, module diagram, and one or two simulation captures from board bring-up.',
		},
		evidenceToAdd: [
			'short architecture sketch of one FPGA lab',
			'Quartus or ModelSim screenshots',
		],
		note: 'Supporting FPGA coursework and lab material are linked here.',
	},
];

export const portfolioTracks: PortfolioTrack[] = [
	{
		slug: 'design',
		label: 'design',
		href: '/projects/design',
		landingDescription: 'Product storytelling, interface systems, and brand-to-UX translation across telecom and web3 surfaces.',
		pageEyebrow: 'projects / design',
		pageTitle: 'design engineering work',
		pageDescription:
			'This track focuses on product framing, information hierarchy, and the interface decisions that made complex systems feel usable.',
		introMessages: [
			'i use design to make dense technical systems legible.',
			'this track covers landing pages, dashboards, and interface systems across telecom and web3 products.',
		],
	},
	{
		slug: 'software',
		label: 'software',
		href: '/projects/software',
		landingDescription: 'AI-assisted products, operational tooling, and full-stack systems built around real user workflows.',
		pageEyebrow: 'projects / software',
		pageTitle: 'software engineering work',
		pageDescription:
			'This track emphasizes application logic, system behavior, product workflows, and the front-end/backend integration behind them.',
		introMessages: [
			'i build product workflows where front-end experience and system behavior have to work together.',
			'this track covers ai-assisted products, operational tooling, and full-stack application work.',
		],
	},
	{
		slug: 'hardware',
		label: 'hardware',
		href: '/projects/hardware',
		landingDescription: 'Mixed-signal IC design, custom layout verification, RTL, FPGA systems, and hardware-software co-design.',
		pageEyebrow: 'projects / hardware',
		pageTitle: 'hardware engineering work',
		pageDescription:
			'This track covers the semiconductor and digital-systems side of my work, from analog block design through verification and hardware-software integration.',
		introMessages: [
			'my hardware work spans mixed-signal ic design, physical verification, rtl, and fpga systems.',
			'these case studies focus on architecture, simulation, and verification results.',
		],
	},
];

export const portfolioTrackProjects: Record<PortfolioCategory, PortfolioTrackProject[]> = {
	design: [
		{
			slug: 'karrier-one-main-site',
			tier: 'featured',
			summary: 'A landing experience built to explain decentralized telecom infrastructure without overwhelming first-time visitors.',
			problem:
				'How do you explain telecom infrastructure, digital identity, and web3 mechanics without losing the user in the first scroll?',
			shipped:
				'I helped simplify the narrative, shape the page hierarchy, and ship a production landing flow with stronger pacing and clearer calls to action.',
		},
		{
			slug: 'karrier-dashboard',
			tier: 'featured',
			summary: 'A logged-in product surface for identity, KYC, services, numbers, and operational telecom actions.',
			problem:
				'How do you make KYC, identity, and service-management flows feel usable when the underlying system is operationally dense?',
			shipped:
				'I worked on the UX direction and front-end structure so the dashboard felt calmer, clearer, and more legible for real product workflows.',
		},
		{
			slug: 'karrier-foundation',
			tier: 'supporting',
			summary:
				'A mission-first site that reframed decentralized connectivity as public-interest infrastructure with softer pacing and more editorial storytelling.',
		},
	],
	software: [
		{
			slug: 'llm-assembly-guide',
			tier: 'featured',
			summary: 'A capstone product that turns static assembly PDFs into adaptive instructions, progress tracking, and vision-assisted guidance.',
			problem:
				'How do you turn static manuals into a live workflow that can adapt instructions, answer questions, and track assembly progress in context?',
			shipped:
				'I led the user-facing workflow and helped ship a live prototype that parses PDFs, generates cited steps, and supports progress tracking plus vision-assisted validation.',
		},
		{
			slug: 'karrier-dashboard',
			tier: 'featured',
			summary: 'A TypeScript-heavy product surface that ties identity, services, analytics, and telecom operations into one logged-in system.',
			problem:
				'How do you support identity, service setup, analytics, and device operations in one product without burying users in system complexity?',
			shipped:
				'I worked across the React/TypeScript front-end and product structure for flows tied to KYC, service setup, and operational tooling around live network activity.',
		},
	],
	hardware: [
		{
			slug: 'ecg-front-end',
			tier: 'featured',
			summary: 'A smartwatch-oriented mixed-signal ECG front-end integrating analog acquisition, programmable gain, and SAR conversion under a 1 V supply.',
			problem:
				'How do you acquire low-amplitude ECG signals and digitize them on-chip under a strict 1 V, low-power constraint?',
			shipped:
				'I designed and verified the analog chain end-to-end, from mux and PGA through op-amp and SAR ADC, then documented the final system in a full report.',
		},
		{
			slug: 'layout-verification',
			tier: 'featured',
			summary: 'A full custom layout and verification flow for an analog amplifier in TSMC 65 nm, from drafting through extracted validation.',
			problem:
				'How do you carry an analog design through layout, DRC, LVS, and extraction without losing the behavior that mattered at schematic level?',
			shipped:
				'I completed layout, rule closure, extraction, and post-layout comparison so the design was validated as both geometry and electrical behavior.',
		},
		{
			slug: 'aes-soc',
			tier: 'supporting',
			summary:
				'A memory-mapped AES-128 coprocessor verified against NIST vectors in simulation and exercised through the HW/SW SoC path.',
		},
		{
			slug: 'fpga-digital-systems',
			tier: 'supporting',
			summary:
				'FPGA and embedded systems work covering RTL modules, memory-mapped interfaces, simulation, and board-level validation on DE1-SoC hardware.',
		},
	],
};

export const featuredPortfolioProjects = portfolioProjects.filter(project => project.featured);

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
			'Full layout drafting and verification report covering DRC, LVS, PEX, and post-layout simulation of a common-source amplifier.',
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
		description: 'Supporting artifacts for the common-source analog design and analysis work.',
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
