/**
 *
 * @param {import('@cloudflare/workers-types').EventContext<any,any,any>} context
 * @returns
 */
export async function onRequest() {
	return new Response(null, {
		status: 303,
		headers: {
			Location: `/`,
			'Set-Cookie': `token=; Secure; HttpOnly; Path=/; Max-Age=0`
		}
	});
}
