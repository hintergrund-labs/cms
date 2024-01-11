/**
 * Generates a unique ID
 * @returns {string} - A unique ID
 */
export function generateId() {
	return Math.random().toString(36).substring(2, 12);
}
