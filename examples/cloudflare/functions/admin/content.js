import { Octokit } from '@octokit/rest';

const config = {
	gitOwner: 'hintergrund-labs',
	gitRepo: 'cms',
	contentDir: 'examples/cloudflare/src/content'
};

/**
 *
 * @param {import('@cloudflare/workers-types').EventContext<any,any,any>} context
 * @returns
 */
export async function onRequestGet(context) {
	try {
		const { request, env } = context;

		const token = await env.GIT_TOKEN;

		const octokit = new Octokit({
			auth: token
		});

		const path = config.contentDir;

		/** @type {import('@octokit/types').OctokitResponse<any>} */
		const contentFiles = await octokit.rest.repos.getContent({
			owner: config.gitOwner,
			repo: config.gitRepo,
			path
		});

		if (contentFiles.status !== 200 || !contentFiles.data || !contentFiles.data.length) {
			return new Response(JSON.stringify(contentFiles));
		}

		const content = await Promise.all(
			contentFiles.data.map(async (/** @type {{ path: string; name: string; }} */ collection) => {
				const collectionFile = await octokit.rest.repos.getContent({
					owner: config.gitOwner,
					repo: config.gitRepo,
					path: collection.path
				});

				return {
					[collection.name.replace('.json', '')]: JSON.parse(atob(collectionFile.data.content))
				};
			})
		);

		const contentObject = content.reduce((acc, cur) => ({ ...acc, ...cur }), {});

		return new Response(JSON.stringify(contentObject), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500
		});
	}
}

/**
 *
 * @param {import('@cloudflare/workers-types').EventContext<any,any,any>} context
 * @returns
 */
export async function onRequestPut(context) {
	try {
		const { request, env } = context;

		const commitFiles = await request.json();

		console.log(commitFiles);

		return new Response(JSON.stringify({ success: true }), { status: 200 });

		if (tree) {
			// Get user id from cookie
			const cookie = parse(request.headers.get('cookie') || '');
			const userId = await env.HG_KV.get(`session:${cookie.session_id}`);

			const token = await decrypt(await env.HG_KV.get('git_token'), env.SECRET);

			const octokit = new Octokit({
				auth: token
			});

			const repo = {
				owner: config.gitOwner,
				repo: config.gitRepo
			};
			const branch = config.contentBranch || 'preview';

			let treeSha;
			try {
				treeSha = (await octokit.git.getRef({ ...repo, ref: `heads/${branch}` })).data.object.sha;
				console.log(`Branch ${branch} already exists.`);
			} catch (error) {
				if (error.status === 404) {
					treeSha = await octokit.git.createRef({
						...repo,
						ref: `refs/heads/${branch}`,
						sha: (await octokit.git.getRef({ ...repo, ref: `heads/${config.mainBranch}` })).data
							.object.sha
					});
					console.log(`Branch ${branch} created.`);
				} else {
					throw error;
				}
			}

			console.log(treeSha);

			if (response.status === 201 || response.status === 200) {
				return new Response(JSON.stringify({ success: true, data: response.data }), {
					status: 200
				});
			} else {
				return new Response(JSON.stringify({ success: false, message: response }), {
					status: 500
				});
			}
		}

		return new Response(
			JSON.stringify({ success: false, message: 'No file tree was provided in the request body' }),
			{
				status: 500
			}
		);
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500
		});
	}
}

// Delete static file on GitHub
export async function onRequestDelete(context) {
	try {
		const { env, request } = context;
		const { message, repository, path } = await request.json();

		console.log(message, repository, path);
		const token = await env.SvelteCms.get('token');

		const headers = {
			'User-Agent': 'request',
			Accept: 'application/vnd.github+json',
			Authorization: `token ${token}`
		};
		const fileInfo = await fetch(
			`https://api.github.com/repos/${repository}/contents/${path}?ref=main`,
			{ headers }
		).then((res) => res.json());

		console.log(fileInfo);
		if (!fileInfo.sha) {
			return new Response('Resource was already deleted', { status: 204 });
		}
		const body = JSON.stringify({
			message,
			sha: fileInfo.sha,
			branch: 'main'
		});
		console.log(body);
		const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
			method: 'DELETE',
			headers,
			body
		});
		return new Response(response, { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(error.message, {
			status: 500
		});
	}
}
