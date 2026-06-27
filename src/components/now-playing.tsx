import Link from 'next/link';
import {SiSpotify} from 'react-icons/si';
import {useLanyardWS} from 'use-lanyard';
import album from '../../public/album.png';
import {discordId} from '../utils/constants';

export function NowPlaying() {
	const lanyard = useLanyardWS(discordId);
	const spotify = lanyard?.spotify;

	return (
		<div className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
			<p className="text-xs text-neutral-500 dark:text-neutral-400">Spotify</p>

			{spotify ? (
				<div className="mt-3 space-y-3">
					<p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
						What I&apos;m listening to right now.
					</p>
					<Link
						href={`https://open.spotify.com/track/${spotify.track_id}`}
						className="group relative block overflow-hidden rounded-[24px] p-4"
						target="_blank"
					>
						<div className="absolute -inset-[1px] rounded-[24px] border-[3px] border-black/10 dark:border-white/20" />
						<div className="absolute inset-0">
							<div className="absolute inset-0 z-10 bg-white/70 group-hover:bg-white/80 dark:bg-neutral-800/80 dark:group-hover:bg-neutral-800/90" />
							<img
								src={spotify.album_art_url ?? album.src}
								alt="Album art"
								aria-hidden
								className="absolute top-1/2 -translate-y-1/2 scale-[3] blur-3xl saturate-[15] dark:saturate-[10]"
							/>
						</div>

						<div className="relative z-10 flex items-center gap-4 pr-8">
							<img
								src={spotify.album_art_url ?? album.src}
								alt="Album art"
								className="size-14 rounded-md border-2"
							/>
							<div className="min-w-0 space-y-1">
								<p className="line-clamp-1 text-sm">
									<strong>{spotify.song}</strong>
								</p>
								<p className="line-clamp-1 text-sm text-neutral-800 dark:text-white/60">
									{spotify.artist.split('; ').join(', ')}
								</p>
							</div>
						</div>

						<div className="absolute right-4 top-4 z-10">
							<SiSpotify className="size-4 text-neutral-900/80 dark:text-white/50" />
						</div>
					</Link>
				</div>
			) : (
				<p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
					Not listening to anything right now.
				</p>
			)}
		</div>
	);
}
