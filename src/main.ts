import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { exec } from '@actions/exec';

const WORKING_DIR: string = getInput('working-dir') ?? '.';

const main = async () => {
    const message = await exec(`npm audit --production`);

    const github_token = getInput('github_token');

    if (context.payload.pull_request == null) {
        setFailed('No pull request found.');
        return;
    }

    const pull_request_number = context.payload.pull_request.number;

    await createCommentOnPr(context.repo, pull_request_number, message.toString(), github_token);

}

const createCommentOnPr = async (repoContext: { owner: string, repo: string }, prNumber: number, message: string, token: string) => {
    try {
        const octokit = getOctokit(token);

        await octokit.rest.issues.createComment({
            ...repoContext,
            issue_number: prNumber,
            body: `Body: ${message}`
        });

    } catch (error) {
        setFailed(`error: ${error}`);
    }
}

main();
