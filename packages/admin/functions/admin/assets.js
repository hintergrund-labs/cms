import { Octokit } from '@octokit/rest';

const config = {
	gitOwner: 'hintergrund-labs',
	gitRepo: 'cms',
	branch: 'main',
	contentDir: 'examples/cloudflare/src/content',
	assetDir: 'examples/cloudflare/static'
};

/**
 *
 * @param {import('@cloudflare/workers-types').EventContext<any,any,any>} context
 * @returns
 */
export async function onRequestGet(context) {
	try {
		const { request, env } = context;

		const token = await env.GH_TOKEN;

		const octokit = new Octokit({
			auth: token
		});

		/** @type {import('@octokit/types').OctokitResponse<any>} */
		const assetFiles = await octokit.rest.repos.getContent({
			owner: config.gitOwner,
			repo: config.gitRepo,
			path: config.assetDir
		});

		if (assetFiles.status !== 200 || !assetFiles.data || !assetFiles.data.length) {
			return new Response(JSON.stringify(assetFiles), { status: 500 });
		}

		const assetObject = assetFiles.data.map(({ name, path, download_url }) => ({
			name,
			path,
			download_url
		}));

		return new Response(JSON.stringify(assetObject), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify(error), {
			status: 500
		});
	}
}

// Upload static file to GitHub
export async function onRequestPut(context) {
	try {
		const { request, env } = context;

		const token = await env.GH_TOKEN;

		const octokit = new Octokit({
			auth: token
		});

		const { file, content } = await request.json();

		octokit.rest.repos.createOrUpdateFileContents({
			owner: config.gitOwner,
			repo: config.gitRepo,
			path: `${config.assetDir}/${file}`,
			message: `Upload asset ${file} [CI SKIP]`,
			content: content,
			branch: config.branch
		});

		return new Response(
			JSON.stringify({ success: true, message: `Uploaded ${file} to ${config.assetDir}` }),
			{
				status: 200
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
		const { file } = await request.json();
		console.log(file);
		const token = await env.GH_TOKEN;

		const octokit = new Octokit({
			auth: token
		});

		// get file sha
		let fileInfo = await octokit.rest.repos.getContent({
			owner: config.gitOwner,
			repo: config.gitRepo,
			path: `${config.assetDir}/${file}`,
			ref: config.branch
		});

		console.log(fileInfo.data.sha);

		if (!fileInfo.data.sha) {
			return new Response('Resource was already deleted', { status: 204 });
		}

		let response = await octokit.rest.repos.deleteFile({
			owner: config.gitOwner,
			repo: config.gitRepo,
			path: `${config.assetDir}/${file}`,
			message: `Delete asset ${file} [CI SKIP]`,
			sha: fileInfo.data.sha
		});
		if (response.status !== 200) {
			return new Response(`Error deleting ${file} from ${config.assetDir}`, {
				status: 500
			});
		}

		return new Response(`Deleted asset ${file}`, { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(error.message, {
			status: 500
		});
	}
}
