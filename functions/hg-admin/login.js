import { readRequestBody, verifyPw } from './utils';
import { sign } from './jwt';

export async function onRequestPost(context) {
	const { env, request } = context;

	try {
		const secret = await env.SECRET;

		const body = await readRequestBody(request);

		const password = body.password;

		const passwordHash = await env.PASSWORD;

		if (await verifyPw(passwordHash, password, secret)) {
			const token = await sign(secret);

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: {
					'Set-cookie': `token=${token}; Secure; HttpOnly; Path=/; SameSite=Strict`
				}
			});
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Wrong password' }), {
				status: 401
			});
		}
	} catch (error) {
		return new Response(error, { status: 401 });
	}
}
