import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import benny from '../../public/benny.png';
import {Conversation, type ConversationTurn} from '../components/conversation';
import {SiteNav} from '../components/site-nav';
import {UKTimeFormatter} from '../utils/constants';

const DynamicStats = dynamic(() => import('../components/stats').then(mod => mod.Stats), {
	ssr: false,
});

const DynamicNowPlaying = dynamic(
	() => import('../components/now-playing').then(mod => mod.NowPlaying),
	{ssr: false},
);

const DynamicFlightMap = dynamic(
	() => import('../components/flight-map').then(mod => mod.FlightMap),
	{ssr: false},
);

const pillLink =
	'inline-flex items-center rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100';

function getTimeOfDayMessage(hour: number): string {
	if (hour >= 5 && hour < 12) {
		return "I'm usually getting the day started with espresso and work.";
	}

	if (hour >= 12 && hour < 17) {
		return "I'm usually in the middle of work or training.";
	}

	if (hour >= 17 && hour < 21) {
		return "I'm usually wrapping up work or winding down.";
	}

	return "It's usually late enough that I'm either winding down or still working on something.";
}

export default function Home() {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const interval = window.setInterval(() => setNow(new Date()), 60_000);

		return () => window.clearInterval(interval);
	}, []);

	const timeOfDayMessage = getTimeOfDayMessage(now.getHours());

	const turns: ConversationTurn[] = [
		{
			kind: 'reply',
			key: 'intro',
			messages: [
				{key: 'intro-1', content: <>Hi, I&apos;m Cole.</>},
				{
					key: 'intro-2',
					content: (
						<>
							I&apos;m a design engineer. I design products and ship the systems and AI behind
							them. My background is in electrical and computer engineering, with a Bachelor of
							Engineering from the University of Guelph.
						</>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-now', text: 'What are you working on these days?'},
		{
			kind: 'reply',
			key: 'now',
			messages: [
				{
					key: 'now-1',
					content: (
						<>
							Currently a Design Specialist II at Terrion, previously Product Lead and Software
							Engineer at Karrier One.
						</>
					),
				},
				{
					key: 'now-contact',
					content: (
						<div className="flex flex-wrap gap-2">
							<a href="mailto:cole.am@outlook.com" className={pillLink}>
								cole.am@outlook.com
							</a>
							<a
								href="https://www.linkedin.com/in/colemayke/"
								target="_blank"
								rel="noreferrer"
								className={pillLink}
							>
								LinkedIn
							</a>
						</div>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-life', text: 'What do you do outside of work?'},
		{
			kind: 'reply',
			key: 'life',
			messages: [
				{
					key: 'life-1',
					content: (
						<>
							Away from work, I spend most of my time lifting, listening to music, traveling,
							and with my dog.
						</>
					),
				},
				{key: 'life-2', content: <>Benny gets a lot of my attention too.</>},
				{
					key: 'life-benny',
					content: (
						<>
							<div className="mt-1 flex justify-center">
								<img
									src={benny.src}
									alt="Benny, my Shiba Inu"
									className="h-auto w-56 rounded-lg shadow-md"
								/>
							</div>
							<p className="mt-2 text-left">Meet Benny.</p>
						</>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-where', text: 'Where are you based?'},
		{
			kind: 'reply',
			key: 'where',
			messages: [
				{key: 'where-1', content: <>I&apos;m based in Ontario, Canada.</>},
				{
					key: 'where-2',
					content: (
						<>
							Right now it&apos;s{' '}
							<span className="font-semibold">{UKTimeFormatter.format(now)}</span> here.{' '}
							{timeOfDayMessage}
						</>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-socials', text: 'Where else can I find you?'},
		{
			kind: 'reply',
			key: 'socials',
			messages: [
				{
					key: 'socials-1',
					content: (
						<>
							On X, Instagram, or Discord.
							<div className="mt-3 flex flex-wrap gap-2">
								<a
									href="https://x.com/coleieii"
									target="_blank"
									rel="noreferrer"
									className={pillLink}
								>
									X / @coleieii
								</a>
								<a
									href="https://www.instagram.com/colemayke"
									target="_blank"
									rel="noreferrer"
									className={pillLink}
								>
									Instagram / @colemayke
								</a>
								<span className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-700 dark:text-neutral-200">
									Discord / @hhollowtips
								</span>
							</div>
						</>
					),
				},
			],
		},
		{kind: 'prompt', key: 'q-music', text: 'What are you listening to?'},
		{kind: 'block', key: 'now-playing', content: <DynamicNowPlaying />},
		{kind: 'prompt', key: 'q-travel', text: 'Where have you traveled?'},
		{kind: 'block', key: 'flights', content: <DynamicFlightMap />},
		{
			kind: 'reply',
			key: 'stats',
			messages: [{key: 'stats-1', content: <DynamicStats />}],
		},
	];

	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/" />
			<Conversation turns={turns} />
		</main>
	);
}
