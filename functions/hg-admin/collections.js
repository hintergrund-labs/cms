import { Octokit } from '@octokit/rest';

// TODO: Get config from env
const config = {
	gitOwner: 'hintergrund-labs',
	gitRepo: 'cms',
	branch: 'main',
	contentDir: 'examples/todos/content',
	assetDir: 'examples/todos/assets'
};

/**
 *
 * @param {import('@cloudflare/workers-types').EventContext<any,any,any>} context
 * @returns
 */
export async function onRequestGet(context) {
	try {
		const { env } = context;

		const token = await env.GH_TOKEN;

		const octokit = new Octokit({
			auth: token
		});

		// Check permissions
		// const permissions = await octokit.rest.repos.get({
		// 	owner: config.gitOwner,
		// 	repo: config.gitRepo
		// });
		// console.log(permissions)
		// TODO return error if permissions are not correct
		// permissions.data.permissions.push

		// Use if you need to get all files in a directory
		// /** @type {import('@octokit/types').OctokitResponse<any>} */
		// const contentFiles = await octokit.rest.repos.getContent({
		// 	owner: config.gitOwner,
		// 	repo: config.gitRepo,
		// 	path: config.contentDir
		// });

		const configFile = await octokit.rest.repos.getContent({
			owner: config.gitOwner,
			repo: config.gitRepo,
			path: `${config.contentDir}/config.json`
		});

		const contentConfig = JSON.parse(atob(configFile.data.content));

		const collections = await Promise.all(
			Object.keys(contentConfig).map(async (collection) => {
				const collectionFile = await octokit.rest.repos.getContent({
					owner: config.gitOwner,
					repo: config.gitRepo,
					path: `${config.contentDir}/${collection}.json`
				});

				return {
					[collection]: JSON.parse(atob(collectionFile.data.content))
				};
			})
		);

		const collectionsObject = collections.reduce((acc, cur) => ({ ...acc, ...cur }), {});

		return new Response(JSON.stringify({ config: contentConfig, collections: collectionsObject }), {
			status: 200
		});
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

		const changes = await request.json();
		// const changes = {
		// 	todos: {
		// 		ajh3344r1j: {
		// 			title: 'Buy food',
		// 			slug: 'buy-food',
		// 			description: '<h4>Lets buy food</h4><p>Bread<br>Milk<br>Eggs</p> gaga',
		// 			done: false
		// 		}
		// 	},
		// 	globals: {
		// 		title: 'My site hey',
		// 		description: 'My site description',
		// 		keywords: 'my, site, keywords',
		// 		logo: 'favicon.png',
		// 		favicon: 'favicon.png'
		// 	}
		// };

		const token = await env.GH_TOKEN;

		const octokit = new Octokit({
			auth: token
		});

		// Get reference from branch
		const ref = await octokit.rest.git.getRef({
			owner: config.gitOwner,
			repo: config.gitRepo,
			ref: `heads/${config.branch}`
		});

		// Get latest commit
		const commit = await octokit.rest.git.getCommit({
			owner: config.gitOwner,
			repo: config.gitRepo,
			commit_sha: ref.data.object.sha
		});

		// Create blob for each change and save file tree
		const blobs = await Promise.all(
			Object.keys(changes).map(async (collection) => {
				const blob = await octokit.rest.git.createBlob({
					owner: config.gitOwner,
					repo: config.gitRepo,
					content: JSON.stringify(changes[collection], null, 4),
					encoding: 'utf-8'
				});

				return {
					path: `${config.contentDir}/${collection}.json`,
					mode: '100644',
					type: 'blob',
					sha: blob.data.sha
				};
			})
		);

		// Create tree
		const newTree = await octokit.rest.git.createTree({
			owner: config.gitOwner,
			repo: config.gitRepo,
			tree: blobs,
			base_tree: commit.data.tree.sha
		});

		// Create commit
		const newCommit = await octokit.rest.git.createCommit({
			owner: config.gitOwner,
			repo: config.gitRepo,
			message: 'Update content',
			tree: newTree.data.sha,
			parents: [commit.data.sha]
		});

		// Update reference
		await octokit.rest.git.updateRef({
			owner: config.gitOwner,
			repo: config.gitRepo,
			ref: `heads/${config.branch}`,
			sha: newCommit.data.sha
		});

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.log(error);
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

		if (!fileInfo.sha) {
			return new Response('Resource was already deleted', { status: 204 });
		}
		const body = JSON.stringify({
			message,
			sha: fileInfo.sha,
			branch: 'main'
		});
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
