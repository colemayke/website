import {motion} from 'framer-motion';
import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import benny from '../../public/benny.png';
import {MessageGroup} from '../components/message';
import {SiteNav} from '../components/site-nav';
import {UKTimeFormatter} from '../utils/constants';

const DynamicStats = dynamic(() => import('../components/stats').then(mod => mod.Stats), {
	ssr: false,
});

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

export default function PersonalPage() {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const interval = window.setInterval(() => setNow(new Date()), 60_000);

		return () => window.clearInterval(interval);
	}, []);

	const timeOfDayMessage = getTimeOfDayMessage(now.getHours());

	return (
		<main className="mx-auto max-w-xl px-3 pb-16 pt-10">
			<SiteNav currentPath="/personal" />

			<motion.ul
				transition={{
					staggerChildren: 0.3,
					delayChildren: 0.3,
				}}
				initial="hidden"
				animate="show"
				className="space-y-8"
			>
				<MessageGroup
					messages={[
						{
							key: 'personal-intro',
							content: (
								<>
									Outside of engineering, I spend most of my time lifting, listening to music, traveling, and with my dog.
								</>
							),
						},
						{
							key: 'personal-home',
							content: <>I keep this page simple, but I like having one place for the off-clock side of life.</>,
						},
					]}
				/>

				<MessageGroup
					messages={[
						{
							key: 'off-clock',
							content: (
								<>
									Benny gets a lot of my attention outside of work too.
								</>
							),
						},
						{
							key: 'benny-photo',
							content: (
								<>
									<div className="mt-2 flex justify-center">
										<img
											src={benny.src}
											alt="Benny, my Shiba Inu"
											className="h-auto w-64 rounded-lg shadow-md"
										/>
									</div>
									<p className="mt-2 text-left text-sm">Meet Benny.</p>
								</>
							),
						},
					]}
				/>

				<MessageGroup
					messages={[
						{
							key: 'location-caption',
							content: <p>I&apos;m based in Ontario, Canada.</p>,
						},
						{
							key: 'local-time',
							content: (
								<p>
									Current local time:{' '}
									<span className="font-semibold">
										{UKTimeFormatter.format(now)}
									</span>
									. <span>{timeOfDayMessage}</span>
								</p>
							),
						},
					]}
				/>

				<MessageGroup
					messages={[
						{
							key: 'socials',
							content: (
								<>
									Away from work, you can also find me on X, Instagram, or Discord.
									<div className="mt-3 flex flex-wrap gap-2">
										<a
											href="https://x.com/coleieii"
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
										>
											X / @coleieii
										</a>
										<a
											href="https://www.instagram.com/colemayke"
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
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
					]}
				/>

				<MessageGroup
					messages={[
						{
							key: 'personal-note',
							content: <>I like keeping one small corner of the site for life outside work.</>,
						},
						{
							key: 'stats',
							content: <DynamicStats />,
						},
					]}
				/>
			</motion.ul>
		</main>
	);
}
