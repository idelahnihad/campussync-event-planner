# CampusSync - Genuine CI/CD Evidence Guide

The required proof is a real content update on a new GitHub branch, review and merge into `main`, automatic deployment, and before/after screenshots of the deployed application. Do not create simulated screenshots or describe this sequence as complete before it happens.

## Before starting

- The Part 2 source is pushed to `main`.
- GitHub Actions has run successfully for the current source.
- Render is connected to the same GitHub repository with automatic deployment enabled.
- The public deployed site is working.

## Step 1 - Capture the deployed page before the update

1. Open the real deployed Home page in a normal browser window.
2. Capture the current hero text and the browser address bar.
3. Save the image as `CICD-01-Before-Update.png`.

The current paragraph is:

> CampusSync helps students share workshops, club meetings, sports, and academic events without complicated event-management tools.

## Step 2 - Create a feature branch

In Anaconda Prompt:

```bat
cd /d C:\CampusSync\CampusSync
git checkout main
git pull origin main
git checkout -b release/part2-cicd-visible-update
```

## Step 3 - Make one visible update

Open `src/pages/Home.tsx` in Spyder. Replace only the current hero paragraph with:

> CampusSync brings campus workshops, club meetings, sports, and academic events into one simple calendar.

Save the file. Do not use Spyder's Run button for the TypeScript file.

Check the application locally if desired, then run:

```bat
npm run check
npm test
npm run build
```

## Step 4 - Commit and push the branch

```bat
git add src/pages/Home.tsx
git commit -m "Update landing page for Part 2 CI/CD demonstration"
git push origin release/part2-cicd-visible-update
```

Capture the branch and commit on GitHub as `CICD-02-Feature-Branch.png`.

## Step 5 - Review and merge

1. Open a pull request from `release/part2-cicd-visible-update` into `main`.
2. Confirm the GitHub Actions checks start and complete successfully.
3. Have another member review and approve the pull request.
4. Merge the pull request.
5. Capture the successful checks and merged pull request as `CICD-03-Checks-and-Merge.png`.

## Step 6 - Verify automatic deployment

1. Open the Render service's Events or Deploys page.
2. Confirm a new deployment was triggered by the merge commit on `main`.
3. Wait until the deployment is Live.
4. Capture the successful deployment as `CICD-04-Automatic-Deploy.png`.

A GitHub merge alone is not proof that the website updated. The deployment must finish successfully.

## Step 7 - Capture the deployed page after the update

1. Return to the same public Home URL.
2. Press Ctrl+Shift+R to hard-refresh.
3. Confirm the new paragraph is visible.
4. Capture the same area and browser address bar as the before image.
5. Save the image as `CICD-05-After-Update.png`.

If the old text remains, wait for the deploy to finish and hard-refresh again. Do not edit the screenshots to create the appearance of a change.

## Evidence set to retain

- `CICD-01-Before-Update.png`
- `CICD-02-Feature-Branch.png`
- `CICD-03-Checks-and-Merge.png`
- `CICD-04-Automatic-Deploy.png`
- `CICD-05-After-Update.png`
- The real pull-request URL and merge-commit identifier
- The real deployed-site URL

These captures belong in the final CI/CD evidence section. They are not available until the team performs the real account-based workflow.
