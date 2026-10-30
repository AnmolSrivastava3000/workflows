# BharatCode PR Reviewer

An automated Pull Request code-review prototype built using **GitHub Actions, Node.js, Octokit, and the BharatCode AI API**.

The project demonstrates how a GitHub Actions workflow can automatically detect pull-request activity, retrieve the associated Git diff, and submit the changed code to an AI model for review.

## Overview

Code reviews are an important part of software development, but manually reviewing every change can be time-consuming.

This project explores automating part of that process by integrating an AI-powered review request into a GitHub Actions workflow.

Whenever a pull request is opened or updated, the workflow:

1. Automatically triggers through GitHub Actions.
2. Retrieves the pull-request diff using the GitHub API.
3. Validates and prepares the diff.
4. Sends the changes to the BharatCode AI API.
5. Retrieves the AI-generated review and prints it in the workflow logs.

## Tech Stack

- **JavaScript (Node.js):** Core application logic.
- **GitHub Actions:** Workflow automation and CI execution.
- **Octokit:** GitHub REST API integration.
- **OpenAI Node.js SDK:** API communication using a custom base URL.
- **BharatCode AI:** AI model integration.
- **Git & GitHub:** Version control and pull-request management.

## Project Structure

```text
workflows/
│
├── .github/
│   └── workflows/
│       └── review.yml
│
├── reviewer.js
├── package.json
├── package-lock.json
└── README.md
```

## How It Works

```text
Developer creates or updates a Pull Request
                    |
                    v
             GitHub Actions
                    |
                    v
             Checkout Repository
                    |
                    v
             Install Dependencies
                    |
                    v
              reviewer.js
                    |
                    v
          Fetch Pull Request Diff
               (Octokit)
                    |
                    v
          Validate and Prepare Diff
                    |
                    v
            BharatCode AI API
                    |
                    v
          AI-Generated Code Review
                    |
                    v
           GitHub Actions Logs
```

## Workflow Trigger

The GitHub Actions workflow listens for these pull-request events:

- `opened` — when a new pull request is created.
- `synchronize` — when additional commits are pushed to an existing pull request.

The workflow runs on an Ubuntu environment using Node.js 22.

## Setup and Configuration

### 1. Clone the repository

```bash
git clone https://github.com/AnmolSrivastava3000/workflows.git
cd workflows
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure GitHub Secrets

Navigate to:

**Repository → Settings → Secrets and variables → Actions**

Add the following repository secret:

| Secret | Description |
|---|---|
| `BHARATCODE_API_KEY` | API key for BharatCode AI |

GitHub automatically provides the `GITHUB_TOKEN` to the workflow.

### 4. Configure the workflow

The workflow is defined in:

```text
.github/workflows/review.yml
```

It installs dependencies and executes:

```bash
node reviewer.js
```

### 5. Trigger a review

Create a pull request or push additional commits to an existing pull request.

The workflow will execute automatically. Review the **Actions** tab in GitHub to inspect execution logs.

## Implementation Details

### Pull Request Diff Retrieval

Octokit is used to retrieve the raw Git diff through the GitHub REST API.

The implementation identifies the repository owner, repository name, and pull-request number from the GitHub Actions context.

### AI Integration

The project uses the OpenAI Node.js SDK configured with BharatCode's custom API endpoint.

The Git diff is passed to the configured model along with a system prompt instructing it to act as a senior software engineer and review the changes.

The prompt also treats code and comments within the diff as untrusted input rather than instructions.

### Basic Safeguards

- Validates the pull-request context.
- Checks whether the retrieved diff is empty.
- Limits the diff size to 50,000 characters.
- Uses GitHub Secrets for sensitive API credentials.
- Reports failures through GitHub Actions.

## Current Status

**Implemented:**
- GitHub Actions pull-request automation.
- Automatic diff retrieval using Octokit.
- Node.js integration with the BharatCode API.
- AI review request construction.
- Execution logging and error handling.
- Secure API key configuration through GitHub Secrets.

**Known limitation:**

The BharatCode API returned HTTP 402 during testing because API usage requires an eligible subscription or verified student access.

As a result, the workflow successfully retrieves the pull-request diff and reaches the AI API, but a completed AI review could not be verified under the available account plan.

AI-generated reviews are currently intended to appear in GitHub Actions logs. Automatic pull-request comments and inline review annotations have not been implemented.

## Future Improvements

- Publish AI-generated reviews directly as pull-request comments.
- Add inline code suggestions and severity classifications.
- Support larger pull requests through diff chunking.
- Add file-type filtering and review customization.
- Introduce automated tests for diff processing and API handling.

## Learning Outcomes

This project provided practical experience with:

- GitHub Actions and event-driven automation.
- GitHub REST API integration using Octokit.
- Node.js ES modules and asynchronous API calls.
- Environment variables and secret management.
- CI workflows and dependency installation.
- Integrating third-party AI APIs into developer tools.

---

**Author:** Anmol Srivastava

**GitHub:** [AnmolSrivastava3000](https://github.com/AnmolSrivastava3000)

**Repository:** [BharatCode PR Reviewer](https://github.com/AnmolSrivastava3000/workflows)
