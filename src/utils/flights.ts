export interface Airport {
	code: string;
	city: string;
	name: string;
	country: string;
	lat: number;
	lon: number;
}

export interface Flight {
	date: string;
	code: string;
	from: string;
	to: string;
	airline: string;
	aircraft?: string;
}

export const airports: Record<string, Airport> = {
	YYZ: {code: 'YYZ', city: 'Toronto', name: 'Toronto Pearson', country: 'Canada', lat: 43.6777, lon: -79.6248},
	LAX: {code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States', lat: 33.9416, lon: -118.4085},
	TPE: {code: 'TPE', city: 'Taipei', name: 'Taoyuan', country: 'Taiwan', lat: 25.0777, lon: 121.233},
	SIN: {code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore', lat: 1.3592, lon: 103.9894},
	DXB: {code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'United Arab Emirates', lat: 25.2528, lon: 55.3644},
	CDG: {code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', lat: 49.0097, lon: 2.5479},
	MIA: {code: 'MIA', city: 'Miami', name: 'Miami International', country: 'United States', lat: 25.7932, lon: -80.2906},
	LAS: {code: 'LAS', city: 'Las Vegas', name: 'Harry Reid', country: 'United States', lat: 36.084, lon: -115.1537},
	ICN: {code: 'ICN', city: 'Seoul', name: 'Incheon', country: 'South Korea', lat: 37.4602, lon: 126.4407},
	YUL: {code: 'YUL', city: 'Montréal', name: 'Montréal–Trudeau', country: 'Canada', lat: 45.4706, lon: -73.7408},
	KIX: {code: 'KIX', city: 'Osaka', name: 'Kansai', country: 'Japan', lat: 34.4347, lon: 135.244},
	YVR: {code: 'YVR', city: 'Vancouver', name: 'Vancouver International', country: 'Canada', lat: 49.1947, lon: -123.1792},
};

export const flights: Flight[] = [
	{date: '2023-06-28', code: 'AC795', from: 'YYZ', to: 'LAX', airline: 'Air Canada', aircraft: 'Airbus A321'},
	{date: '2023-06-29', code: 'BR15', from: 'LAX', to: 'TPE', airline: 'EVA Air', aircraft: 'Boeing 777-300ER'},
	{date: '2023-07-15', code: 'BR36', from: 'TPE', to: 'YYZ', airline: 'EVA Air', aircraft: 'Boeing 777-300ER'},
	{date: '2023-09-11', code: 'SQ37', from: 'LAX', to: 'SIN', airline: 'Singapore Airlines', aircraft: 'Airbus A350-900'},
	{date: '2023-09-19', code: 'SQ494', from: 'SIN', to: 'DXB', airline: 'Singapore Airlines', aircraft: 'Airbus A350-900'},
	{date: '2023-09-23', code: 'EK241', from: 'DXB', to: 'YYZ', airline: 'Emirates'},
	{date: '2024-04-07', code: 'AC872', from: 'YYZ', to: 'CDG', airline: 'Air Canada', aircraft: 'Boeing 777-300ER'},
	{date: '2024-04-13', code: 'AC873', from: 'CDG', to: 'YYZ', airline: 'Air Canada', aircraft: 'Boeing 777-300ER'},
	{date: '2024-08-01', code: 'AC61', from: 'YYZ', to: 'ICN', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2024-12-15', code: 'AC101', from: 'YYZ', to: 'YVR', airline: 'Air Canada', aircraft: 'Boeing 737 MAX 8'},
	{date: '2025-01-30', code: 'AC62', from: 'ICN', to: 'YYZ', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2025-04-10', code: 'AC56', from: 'YYZ', to: 'DXB', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2025-05-03', code: 'AC57', from: 'DXB', to: 'YYZ', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2025-09-20', code: 'AC404', from: 'YYZ', to: 'YUL', airline: 'Air Canada', aircraft: 'Airbus A320'},
	{date: '2025-09-20', code: 'AC67', from: 'YUL', to: 'ICN', airline: 'Air Canada'},
	{date: '2025-09-26', code: 'KE647', from: 'ICN', to: 'SIN', airline: 'Korean Air', aircraft: 'Airbus A330-300'},
	{date: '2025-10-12', code: 'KE726', from: 'KIX', to: 'ICN', airline: 'Korean Air'},
	{date: '2025-10-12', code: 'AC62', from: 'ICN', to: 'YYZ', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2025-10-14', code: 'AC62', from: 'ICN', to: 'YYZ', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2025-11-27', code: 'AC1701', from: 'YYZ', to: 'LAS', airline: 'Air Canada', aircraft: 'Airbus A321'},
	{date: '2025-11-30', code: 'AC1702', from: 'LAS', to: 'YYZ', airline: 'Air Canada', aircraft: 'Airbus A320'},
	{date: '2025-12-15', code: 'AC63', from: 'YVR', to: 'ICN', airline: 'Air Canada', aircraft: 'Boeing 787-9'},
	{date: '2026-01-26', code: 'AC1199', from: 'MIA', to: 'YYZ', airline: 'Air Canada', aircraft: 'Bombardier CS300'},
];

export interface Route {
	from: string;
	to: string;
	count: number;
}

// Unique undirected routes (one line per city pair), with how many times flown.
export const uniqueRoutes: Route[] = (() => {
	const map = new Map<string, Route>();

	for (const flight of flights) {
		const key = [flight.from, flight.to].sort().join('-');
		const existing = map.get(key);

		if (existing) {
			existing.count += 1;
		} else {
			map.set(key, {from: flight.from, to: flight.to, count: 1});
		}
	}

	return [...map.values()];
})();

function haversineKm(a: Airport, b: Airport) {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const r = 6371;
	const dLat = toRad(b.lat - a.lat);
	const dLon = toRad(b.lon - a.lon);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);

	const h =
		Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

	return 2 * r * Math.asin(Math.sqrt(h));
}

const countryFlags: Record<string, string> = {
	Canada: '🇨🇦',
	'United States': '🇺🇸',
	Taiwan: '🇹🇼',
	Singapore: '🇸🇬',
	'United Arab Emirates': '🇦🇪',
	France: '🇫🇷',
	'South Korea': '🇰🇷',
	Japan: '🇯🇵',
};

export interface CountryVisit {
	country: string;
	flag: string;
	count: number;
}

// Times landed in each country, with any country only departed from counted at
// least once (so every place flown through still shows up).
export const countryVisits: CountryVisit[] = (() => {
	const counts = new Map<string, number>();

	for (const flight of flights) {
		const to = airports[flight.to];
		if (to) {
			counts.set(to.country, (counts.get(to.country) ?? 0) + 1);
		}
	}

	for (const flight of flights) {
		for (const code of [flight.from, flight.to]) {
			const airport = airports[code];
			if (airport && !counts.has(airport.country)) {
				counts.set(airport.country, 1);
			}
		}
	}

	return [...counts.entries()]
		.map(([country, count]) => ({country, count, flag: countryFlags[country] ?? '🏳️'}))
		.sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
})();

export const flightStats = (() => {
	const distanceKm = flights.reduce((sum, flight) => {
		const from = airports[flight.from];
		const to = airports[flight.to];

		if (!from || !to) {
			return sum;
		}

		return sum + haversineKm(from, to);
	}, 0);

	const countries = new Set(
		Object.values(airports)
			.filter(airport =>
				flights.some(flight => flight.from === airport.code || flight.to === airport.code),
			)
			.map(airport => airport.country),
	);

	const visitedAirports = new Set(flights.flatMap(flight => [flight.from, flight.to]));

	return {
		flights: flights.length,
		routes: uniqueRoutes.length,
		airports: visitedAirports.size,
		countries: countries.size,
		distanceKm: Math.round(distanceKm),
	};
})();
