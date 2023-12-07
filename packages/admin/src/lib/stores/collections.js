import { writable } from 'svelte/store';

/** @typedef {{[id: string]: any | 'delete'}} Changes */
/** @typedef {{}} */

function initChanges() {
	const local = typeof window !== 'undefined' ? localStorage.getItem('changes') : '{}';

	/**  @type {import('svelte/store').Writable<Changes>} */
	const { subscribe, set, update } = writable(local ? JSON.parse(local) : {});

	return {
		subscribe,
		update,
		delete: (/** @type {string} */ key) => {
			update((changes) => {
				changes[key] = 'delete';
				return changes;
			});
		},
		set: (/** @type {Changes} */ newChanges) => {
			set(newChanges || {});
		}
	};
}

export const changes = initChanges();

/** @type {import('svelte/store').Writable<any>} */
export const collections = writable();
