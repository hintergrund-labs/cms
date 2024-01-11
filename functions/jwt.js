// Simplified code from https://github.com/tsndr/cloudflare-worker-jwt
function textToBase64Url(str) {
	return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function bytesToByteString(bytes) {
	let byteStr = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		byteStr += String.fromCharCode(bytes[i]);
	}
	return byteStr;
}

function byteStringToBytes(byteStr) {
	let bytes = new Uint8Array(byteStr.length);
	for (let i = 0; i < byteStr.length; i++) {
		bytes[i] = byteStr.charCodeAt(i);
	}
	return bytes;
}

function arrayBufferToBase64String(arrayBuffer) {
	return btoa(bytesToByteString(new Uint8Array(arrayBuffer)));
}

function base64StringToArrayBuffer(b64str) {
	return byteStringToBytes(atob(b64str)).buffer;
}

function textToArrayBuffer(str) {
	return byteStringToBytes(decodeURI(encodeURIComponent(str)));
}

function arrayBufferToBase64Url(arrayBuffer) {
	return arrayBufferToBase64String(arrayBuffer)
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function base64UrlToArrayBuffer(b64url) {
	return base64StringToArrayBuffer(b64url.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
}

async function importTextSecret(key, algorithm) {
	return await crypto.subtle.importKey('raw', textToArrayBuffer(key), algorithm, true, [
		'verify',
		'sign'
	]);
}

async function importKey(key, algorithm) {
	return importTextSecret(key, algorithm);
}

function decodePayload(raw) {
	try {
		return JSON.parse(atob(raw));
	} catch {
		return;
	}
}

/**
 * Signs a payload and returns the token
 *
 * @param {JwtPayload} payload The payload object. To use `nbf` (Not Before) and/or `exp` (Expiration Time) add `nbf` and/or `exp` to the payload.
 * @param {string | JsonWebKey} secret A string which is used to sign the payload.
 * @param {JwtSignOptions | JwtAlgorithm | string} [options={ algorithm: 'HS256', header: { typ: 'JWT' } }] The options object or the algorithm.
 * @throws {Error} If there's a validation issue.
 * @returns {Promise<string>} Returns token as a `string`.
 */
export async function sign(secret) {
	const options = {
		alg: 'HS256',
		typ: 'JWT'
	};

	const now = Math.floor(Date.now() / 1000);

	// Create payload valid for 2 days
	const payload = {
		iat: now,
		exp: now + 2 * 24 * 60 * 60
	};

	const partialToken = `${textToBase64Url(JSON.stringify(options))}.${textToBase64Url(
		JSON.stringify(payload)
	)}`;

	// Derive a 256-bit key from the secret
	const key = await crypto.subtle.importKey(
		'raw',
		textToArrayBuffer(secret),
		{ name: 'HMAC', hash: { name: 'SHA-256' } },
		true,
		['verify', 'sign']
	);
	const signature = await crypto.subtle.sign(
		{ name: 'HMAC', hash: { name: 'SHA-256' } },
		key,
		textToArrayBuffer(partialToken)
	);

	return `${partialToken}.${arrayBufferToBase64Url(signature)}`;
}

/**
 * Verifies the integrity of the token and returns a boolean value.
 *
 * @param {string} token The token string generated by `jwt.sign()`.
 * @param {string | JsonWebKey} secret The string which was used to sign the payload.
 * @param {JWTVerifyOptions | JWTAlgorithm} options The options object or the algorithm.
 * @throws {Error | string} Throws an error `string` if the token is invalid or an `Error-Object` if there's a validation issue.
 * @returns {Promise<boolean>} Returns `true` if signature, `nbf` (if set) and `exp` (if set) are valid, otherwise returns `false`.
 */
export async function verify(token, secret) {
	const tokenParts = token.split('.');

	if (tokenParts.length !== 3) throw new Error('token must consist of 3 parts');

	const { payload } = decode(token);

	try {
		if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('EXPIRED');

		const key = await importKey(secret, { name: 'HMAC', hash: { name: 'SHA-256' } });

		return await crypto.subtle.verify(
			{ name: 'HMAC', hash: { name: 'SHA-256' } },
			key,
			base64UrlToArrayBuffer(tokenParts[2]),
			textToArrayBuffer(`${tokenParts[0]}.${tokenParts[1]}`)
		);
	} catch (err) {
		return false;
	}
}

/**
 * Returns the payload **without** verifying the integrity of the token. Please use `jwt.verify()` first to keep your application secure!
 *
 * @param {string} token The token string generated by `jwt.sign()`.
 * @returns {JwtData} Returns an `object` containing `header` and `payload`.
 */
export function decode(token) {
	return {
		header: decodePayload(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')),
		payload: decodePayload(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
	};
}
