import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const main = async () => {
    const stdin = process.openStdin();

    let auditJson = "";

    stdin.on('data', (chunk: string): void => {
        auditJson += chunk;
    });

    stdin.on('end', async (): Promise<void> => {
        console.log(auditJson);
        const message = auditJson;
        const github_token = getInput('github_token');

        if (context.payload.pull_request == null) {
            setFailed('No pull request found.');
            return;
        }
        const pull_request_number = context.payload.pull_request.number;

        await createCommentOnPr(context.repo, pull_request_number, message, github_token);
    });
}

const createCommentOnPr = async (repoContext: { owner: string, repo: string }, prNumber: number, message: string, token: string) => {
    try {
        const octokit = getOctokit(token);

        await octokit.rest.issues.createComment({
            ...repoContext,
            issue_number: prNumber,
            body: message
        });

    } catch (error) {
        setFailed(`error: ${error}`);
    }
}

main();
