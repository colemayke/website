import Link from 'next/link';
import {Conversation, type ConversationTurn} from '../components/conversation';
import {SiteNav} from '../components/site-nav';

const underline = 'nice-underline-neutral-400 dark:nice-underline-neutral-200/50';

export default function ExperiencePage() {
	const turns: ConversationTurn[] = [
		{
			kind: 'reply',
			key: 'intro',
			messages: [
				{key: 'i1', content: <>Quick walkthrough of how I got here.</>},
				{
					key: 'i2',
					content: (
						<>
							I&apos;m a design engineer. Most of my work has been taking vague ideas and
							complicated products and making them easy to interact with.
						</>
					),
				},
			],
		},
		{
			kind: 'reply',
			key: 'terrion',
			messages: [
				{key: 't1', content: <>Right now I&apos;m at Terrion, as a Design Specialist II.</>},
				{
					key: 't2',
					content: (
						<>
							I work on AI automation for the commercial leasing side, the data infrastructure
							behind it, and the front-end and product work on top.
						</>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-before', text: 'Where were you before that?'},
		{
			kind: 'reply',
			key: 'karrier',
			messages: [
				{
					key: 'k1',
					content: (
						<>
							Karrier One, for about two and a half years. I started as a software engineer and
							ended up leading product.
						</>
					),
				},
				{
					key: 'k2',
					content: (
						<>
							On the engineering side I built the web platform front-end in Next.js and
							TypeScript, a real-time monitoring and on-chain wallet dashboard in TypeScript and
							.NET, and shipped Move smart contracts on Sui that moved over $4M in on-chain
							revenue.
						</>
					),
				},
				{
					key: 'k3',
					content: (
						<>
							As product lead I ran a 10-plus person team across telecom, fintech, and crypto,
							launched a combined banking and telecom app in Flutter, and helped scale a cellular
							offloading network to 1,000+ devices and a million Wi-Fi users.
						</>
					),
				},
				{
					key: 'k4',
					content: (
						<>
							I also got to travel and represent Karrier One at conferences, TOKEN2049 in
							Singapore and Dubai, and Sui Basecamp in Singapore, France, and Dubai.
						</>
					),
				},
			],
		},
		{
			kind: 'reply',
			key: 'earlier',
			messages: [
				{
					key: 'e1',
					content: (
						<>
							Before Karrier One I did a contract at Gambit building B2B LLM chatbots, and two
							summers at Rogers as a software engineering intern.
						</>
					),
				},
				{
					key: 'e2',
					content: (
						<>
							Rogers was mostly React and mapping tools for the network, plus some Spring Boot
							APIs. That&apos;s where I first got into front-end at any real scale.
						</>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-school', text: 'And school?'},
		{
			kind: 'reply',
			key: 'school',
			messages: [
				{
					key: 's1',
					content: (
						<>
							Electrical and Computer Engineering at the University of Guelph. B.Eng., 2026.
						</>
					),
				},
				{
					key: 's2',
					content: (
						<>
							That&apos;s where the hardware side comes from. The IC and FPGA work lives under{' '}
							<Link href="/projects/hardware" className={underline}>
								hardware
							</Link>{' '}
							if you&apos;re curious.
						</>
					),
				},
			],
		},
	];

	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/experience" />
			<Conversation turns={turns} />
		</main>
	);
}
