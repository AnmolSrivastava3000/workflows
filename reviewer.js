
import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    // 1. Get GitHub token provided by Actions
    const token = core.getInput('github-token', {
      required: true
    });

    const octokit = github.getOctokit(token);

    // 2. Verify that this is a Pull Request event
    const context = github.context;

    if (context.eventName !== 'pull_request') {
      core.info('Not a pull request. Skipping review.');
      return;
    }

    // 3. Extract PR details
    const prNumber = context.payload.pull_request.number;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    core.info(
      `Fetching diff for PR #${prNumber} in ${owner}/${repo}`
    );

    // 4. Fetch raw PR diff
    const { data: diff } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff'
      }
    });

    // 5. Print diff in GitHub Actions logs
    core.info('--- RAW PR DIFF ---');
    core.info(diff);

    core.info('Successfully fetched PR diff!');

  } catch (error) {
    core.setFailed(`Review failed: ${error.message}`);
  }
}

run();
