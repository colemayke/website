import {useEffect, useMemo, useRef, useState} from 'react';
import {airports, flightStats, uniqueRoutes, type Airport} from '../utils/flights';

const W = 1000;
const LAT_TOP = 80;
const LAT_BOTTOM = -56;
const H = ((LAT_TOP - LAT_BOTTOM) / 360) * W;

type Pt = {x: number; y: number};
type Ring = number[][];

// Small paper-plane glyph pointing toward +x, centred on the origin.
const PLANE_PATH = 'M13 0 L-9 -7 L-3 0 L-9 7 Z';

function project(lon: number, lat: number): Pt {
	return {
		x: ((lon + 180) / 360) * W,
		y: ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H,
	};
}

// Project a lon/lat polyline and split it wherever it crosses the antimeridian,
// so nothing streaks across the whole map.
function toSubpaths(points: number[][]): string[] {
	const subpaths: string[] = [];
	let current: string[] = [];
	let prev: Pt | null = null;

	for (const point of points) {
		const lon = point[0] ?? 0;
		const lat = point[1] ?? 0;
		const p = project(lon, lat);

		if (prev && Math.abs(p.x - prev.x) > W / 2) {
			if (current.length > 1) subpaths.push(current.join(' '));
			current = [];
			prev = null;
		}

		current.push(`${prev ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
		prev = p;
	}

	if (current.length > 1) subpaths.push(current.join(' '));
	return subpaths;
}

// Great-circle interpolation between two airports (slerp on the unit sphere).
function greatCircle(
	a: {lat: number; lon: number},
	b: {lat: number; lon: number},
	segments = 64,
): Array<[number, number]> {
	const toRad = (d: number) => (d * Math.PI) / 180;
	const toDeg = (r: number) => (r * 180) / Math.PI;

	const lat1 = toRad(a.lat);
	const lon1 = toRad(a.lon);
	const lat2 = toRad(b.lat);
	const lon2 = toRad(b.lon);

	const v1: [number, number, number] = [
		Math.cos(lat1) * Math.cos(lon1),
		Math.cos(lat1) * Math.sin(lon1),
		Math.sin(lat1),
	];
	const v2: [number, number, number] = [
		Math.cos(lat2) * Math.cos(lon2),
		Math.cos(lat2) * Math.sin(lon2),
		Math.sin(lat2),
	];

	const dot = Math.min(1, Math.max(-1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
	const omega = Math.acos(dot);

	if (omega < 1e-6) {
		return [
			[a.lon, a.lat],
			[b.lon, b.lat],
		];
	}

	const sinOmega = Math.sin(omega);
	const out: Array<[number, number]> = [];

	for (let i = 0; i <= segments; i++) {
		const t = i / segments;
		const k1 = Math.sin((1 - t) * omega) / sinOmega;
		const k2 = Math.sin(t * omega) / sinOmega;
		const x = k1 * v1[0] + k2 * v2[0];
		const y = k1 * v1[1] + k2 * v2[1];
		const z = k1 * v1[2] + k2 * v2[2];

		out.push([toDeg(Math.atan2(y, x)), toDeg(Math.asin(z))]);
	}

	return out;
}

function formatThousands(value: number) {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function FlightMap() {
	const [rings, setRings] = useState<Ring[] | null>(null);
	const planeRefs = useRef<Array<SVGGElement | null>>([]);

	useEffect(() => {
		let active = true;

		fetch('/world-land.json')
			.then(res => res.json())
			.then((data: Ring[]) => {
				if (active) setRings(data);
			})
			.catch(() => {});

		return () => {
			active = false;
		};
	}, []);

	const landPath = useMemo(() => {
		if (!rings) return '';
		return rings.flatMap(ring => toSubpaths(ring)).join(' ');
	}, [rings]);

	const routes = useMemo(() => {
		return uniqueRoutes
			.map(route => {
				const from = airports[route.from];
				const to = airports[route.to];

				if (!from || !to) return null;

				const gc = greatCircle(from, to);
				const points = gc.map(([lon, lat]) => project(lon, lat));

				return {
					key: `${route.from}-${route.to}`,
					d: toSubpaths(gc).join(' '),
					points,
				};
			})
			.filter(Boolean) as Array<{key: string; d: string; points: Pt[]}>;
	}, []);

	const visited = useMemo(() => {
		const codes = new Set(uniqueRoutes.flatMap(route => [route.from, route.to]));
		return [...codes]
			.map(code => airports[code])
			.filter((airport): airport is Airport => Boolean(airport));
	}, []);

	useEffect(() => {
		const reduce =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const periods = routes.map((_, i) => 13 + (i % 5) * 2);
		const offsets = routes.map((_, i) => (i * 0.6180339887) % 1);

		const place = (t: number) => {
			routes.forEach((route, i) => {
				const node = planeRefs.current[i];
				if (!node) return;

				const pts = route.points;
				const f = t * (pts.length - 1);
				const i0 = Math.min(pts.length - 2, Math.floor(f));
				const frac = f - i0;
				const p0 = pts[i0];
				const p1 = pts[i0 + 1];
				if (!p0 || !p1) return;
				const dx = p1.x - p0.x;
				const dy = p1.y - p0.y;

				if (Math.abs(dx) > W / 2) {
					node.style.opacity = '0';
					return;
				}

				const x = p0.x + dx * frac;
				const y = p0.y + dy * frac;
				const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

				node.style.opacity = '1';
				node.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
			});
		};

		if (reduce) {
			place(0.5);
			return;
		}

		let raf = 0;
		const loop = () => {
			const time = performance.now() / 1000;
			routes.forEach((route, i) => {
				const phase = (time / (periods[i] ?? 14) + (offsets[i] ?? 0)) % 1;
				const node = planeRefs.current[i];
				if (!node) return;
				const pts = route.points;
				const f = phase * (pts.length - 1);
				const i0 = Math.min(pts.length - 2, Math.floor(f));
				const frac = f - i0;
				const p0 = pts[i0];
				const p1 = pts[i0 + 1];
				if (!p0 || !p1) return;
				const dx = p1.x - p0.x;
				const dy = p1.y - p0.y;

				if (Math.abs(dx) > W / 2) {
					node.style.opacity = '0';
					return;
				}

				const x = p0.x + dx * frac;
				const y = p0.y + dy * frac;
				const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
				node.style.opacity = '1';
				node.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
			});
			raf = requestAnimationFrame(loop);
		};

		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [routes]);

	return (
		<div className="rounded-[32px] border border-neutral-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
			<p className="text-xs text-neutral-500 dark:text-neutral-400">Flights</p>
			<h2 className="mt-2 text-2xl font-semibold tracking-tight leading-tight text-neutral-900 dark:text-neutral-100">
				Where I&apos;ve flown
			</h2>
			<p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
				{flightStats.flights} flights across {flightStats.countries} countries, about{' '}
				{formatThousands(flightStats.distanceKm)} km in the air.
			</p>

			<div className="mt-4 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-900/50">
				<svg
					viewBox={`0 0 ${W} ${H}`}
					className="h-auto w-full"
					role="img"
					aria-label={`World map of ${flightStats.flights} flights across ${flightStats.countries} countries`}
				>
					{landPath ? (
						<path d={landPath} className="fill-neutral-200 dark:fill-neutral-800" />
					) : null}

					{routes.map(route => (
						<path
							key={route.key}
							d={route.d}
							fill="none"
							strokeWidth={1.1}
							strokeLinecap="round"
							className="stroke-neutral-400/70 dark:stroke-neutral-600/80"
						/>
					))}

					{visited.map(airport => {
						const p = project(airport.lon, airport.lat);
						const isHome = airport.code === 'YYZ';
						return (
							<circle
								key={airport.code}
								cx={p.x}
								cy={p.y}
								r={isHome ? 4 : 3}
								className={
									isHome
										? 'fill-neutral-900 dark:fill-neutral-100'
										: 'fill-neutral-500 dark:fill-neutral-400'
								}
							>
								<title>{`${airport.city} (${airport.code})`}</title>
							</circle>
						);
					})}

					{routes.map((route, i) => (
						<g
							key={`plane-${route.key}`}
							ref={node => {
								planeRefs.current[i] = node;
							}}
							style={{opacity: 0}}
						>
							<path d={PLANE_PATH} className="fill-neutral-800 dark:fill-neutral-100" />
						</g>
					))}
				</svg>
			</div>
		</div>
	);
}
