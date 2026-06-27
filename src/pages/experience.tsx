import {Conversation, type ConversationTurn} from '../components/conversation';
import {SiteNav} from '../components/site-nav';
import {education, experienceCompanies, skillGroups} from '../utils/experience';

const companyPrompts: Record<string, string> = {
	Terrion: 'What are you working on at Terrion?',
	'Karrier One': 'What did you ship at Karrier One?',
	'Gambit Technologies': 'And at Gambit?',
	'Rogers Communications': 'What about Rogers?',
};

export default function ExperiencePage() {
	const turns: ConversationTurn[] = [
		{
			kind: 'reply',
			key: 'exp-intro',
			messages: [
				{key: 'exp-intro-1', content: <>Here&apos;s the working timeline.</>},
				{key: 'exp-intro-2', content: <>I&apos;m a design engineer.</>},
				{
					key: 'exp-intro-3',
					content: (
						<>
							I build products end to end: the interface and front-end, plus the systems, data,
							and AI behind them.
						</>
					),
				},
				{key: 'exp-intro-4', content: <>Mostly across fintech, telecom, and blockchain.</>},
			],
		},
		...experienceCompanies.flatMap((company): ConversationTurn[] => [
			{
				kind: 'prompt',
				key: `${company.company}-q`,
				text: companyPrompts[company.company] ?? `What did you do at ${company.company}?`,
			},
			{
				kind: 'reply',
				key: company.company,
				messages: [
					{
						key: `${company.company}-head`,
						content: (
							<>
								<span className="font-semibold">{company.company}</span>
								<span className="text-neutral-500 dark:text-neutral-400">
									{' '}
									· {company.location}
								</span>
							</>
						),
					},
					...company.roles.map(role => ({
						key: `${company.company}-${role.title}`,
						content: (
							<div>
								<p className="font-semibold">
									{role.title}
									<span className="font-normal text-neutral-500 dark:text-neutral-400">
										{' '}
										· {role.period}
									</span>
								</p>
								<ul className="mt-1.5 space-y-1.5">
									{role.points.map(point => (
										<li key={point} className="flex gap-2">
											<span className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
											<span>{point}</span>
										</li>
									))}
								</ul>
							</div>
						),
					})),
				],
			},
		]),
		{kind: 'prompt', key: 'q-skills', text: 'What do you work with?'},
		{
			kind: 'reply',
			key: 'skills',
			messages: skillGroups.map(group => ({
				key: group.label,
				content: (
					<>
						<span className="font-semibold">{group.label}:</span> {group.items.join(', ')}
					</>
				),
			})),
		},
		{kind: 'prompt', key: 'q-edu', text: 'Where did you go to school?'},
		{
			kind: 'reply',
			key: 'education',
			messages: [
				{
					key: 'education-1',
					content: (
						<>
							I studied {education.credential} at the {education.school}, class of {education.year}.
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
