import { parse } from 'cookie';
import { verify } from './jwt';
import { getTemplate } from './template';

/**
 *
 * @param {{request: Request, next: () => Promise<Response, env: {SECRET?: string}}} context
 * @returns {Promise<Request>}
 */
export async function onRequest(context) {
	const { request, next, env } = context;

	const { pathname } = new URL(request.url);
	if (pathname === '/hg-admin/login' || pathname === '/hg-admin/logout') {
		return await next();
	}

	const cookie = parse(request.headers.get('cookie') || '');
	const token = cookie.token;
	if (token != null) {
		const secret = await env.SECRET;
		const isValid = await verify(token, secret);
		if (isValid) {
			return await next();
		}
	}

	// No cookie or incorrect hash in cookie. Redirect to login.
	return new Response(getTemplate('hg-login'), {
		headers: {
			'content-type': 'text/html'
		}
	});
}
