import { readable, derived } from 'svelte/store';

export const loc = readable(null, function start(set) {
	set(getLocation());

	const update = () => {
		set(getLocation());
	};
	if (typeof window !== 'undefined') {
		window.addEventListener('hashchange', update, false);
	}

	return function stop() {
		if (typeof window === 'undefined') return;
		window.removeEventListener('hashchange', update, false);
	};
});

export const location = derived(loc, ($loc) => $loc.location);
export const collectionId = derived(loc, ($loc) => $loc.collectionId);
export const recordId = derived(loc, ($loc) => $loc.recordId);

function getLocation() {
	if (typeof window === 'undefined') return {};
	const hashPosition = window.location.href.indexOf('#/');
	let loc = hashPosition > -1 ? window.location.href.substr(hashPosition + 1) : '/';

	let location = {};
	// Check if there's a querystring
	const qsPosition = loc.indexOf('?');
	if (qsPosition > -1) {
		location.query = loc.substr(qsPosition + 1);
		loc = loc.substr(0, qsPosition);
	}

	loc = loc.split('/');

	location.location = loc[1];

	if (loc.length === 3 && location.location === 'content') {
		location.collectionId = loc[2];
	} else if (loc.length === 4 && location.location === 'content') {
		location.collectionId = loc[2];
		location.recordId = loc[3];
	}

	return location;
}
