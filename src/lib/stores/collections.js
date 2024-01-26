import { writable } from 'svelte/store';
import { changes } from './changes';

function initCollections() {
	/**  @type {import('svelte/store').Writable<Changes>} */
	const { subscribe, set, update } = writable({});

	return {
		subscribe,
		update,
		set: (collections) => {
			const unsubscribe = changes.subscribe((changes) => {
				if (changes) {
					for (const [id, collection] of Object.entries(changes)) {
						collections[id] = { ...collections[id], ...collection };
					}
				}
			});
			set(collections);
			unsubscribe();
		}
	};
}

/** @type {import('svelte/store').Writable<any>} */
const collections = initCollections();

const config = writable({});

async function fetchData() {
	let data = {};
	try {
		await fetch('/hg-admin/collections')
			.then((response) => response.json())
			.then((json) => {
				data = json;
			});
	} catch (error) {
		console.error('Failed to fetch:', error);
	}
	return data;
}

export { collections, config, fetchData };
