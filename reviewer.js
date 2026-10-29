const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // 1. Get the standard GitHub token provided by Actions
    const token = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);

    // 2. Check the context to ensure this is actually a Pull Request
    const context = github.context;
    if (context.eventName !== 'pull_request') {
      core.info('This event is not a pull request. Skipping review.');
      return;
    }

    // 3. Extract repository and PR details
    const prNumber = context.payload.pull_request.number;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    core.info(`Fetching diff for PR #${prNumber} in ${owner}/${repo}`);

    // 4. Fetch the raw diff from GitHub's API
    const { data: diff } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff' // This tells GitHub to return raw code changes, not JSON
      }
    });

    // 5. Print the diff to the console to prove we got it
    core.info('--- RAW PR DIFF ---');
    core.info(diff);
    
  } catch (error) {
    // If anything fails, mark the action as failed with a red X
    core.setFailed(`Review failed: ${error.message}`);
  }
}

run();