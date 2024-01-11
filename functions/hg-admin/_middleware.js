import { parse } from 'cookie';
import jwt from '@tsndr/cloudflare-worker-jwt';

/**
 *
 * @param {import('@cloudflare/workers-types').EventContext<any,any,any>} context
 * @returns {Promise<any>}
 */
export async function onRequest(context) {
	const { request, next, env } = context;

	const cookie = parse(request.headers.get('cookie') || '');
	const token = cookie.token;
	if (token != null) {
		const secret = await env.SECRET;
		const isValid = await jwt.verify(token, secret);

		if (isValid) {
			return await next();
		}
	}

	// No cookie or incorrect hash in cookie. Redirect to login.
	const url = new URL(request.url);
	return Response.redirect(`${url.origin}/hg-login`, 302);
}
