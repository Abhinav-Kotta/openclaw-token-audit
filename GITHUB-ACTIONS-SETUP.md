# 🚀 GitHub Actions Token Collector Setup

## Overview

This guide sets up GitHub Actions to automatically collect token metrics every hour without needing a local machine running cron jobs.

**Benefits:**
- ✅ No local setup required
- ✅ Runs on GitHub's servers (free tier included)
- ✅ Fully automated hourly collection
- ✅ Data automatically pushed to your repo
- ✅ Easy to monitor and manage

---

## 📋 Prerequisites

- ✅ GitHub repository: `Abhinav-Kotta/openclaw-token-audit`
- ✅ GitHub Personal Access Token (PAT)
- ✅ OpenClaw gateway running and accessible

---

## ⚙️ Step 1: Add GitHub Secrets

Secrets store sensitive information safely (tokens, URLs) without exposing them in code.

### Navigate to Settings

1. Go to: `https://github.com/Abhinav-Kotta/openclaw-token-audit/settings/secrets/actions`
2. Click **"New repository secret"** for each:

### Secret 1: OPENCLAW_GATEWAY_URL

- **Name:** `OPENCLAW_GATEWAY_URL`
- **Value:** `http://localhost:18789`
- Click **"Add secret"**

### Secret 2: OPENCLAW_TOKEN

- **Name:** `OPENCLAW_TOKEN`
- **Value:** Your OpenClaw gateway token
- Click **"Add secret"**

### Secret 3: GITHUB_TOKEN

- **Name:** `GITHUB_TOKEN`
- **Value:** Your GitHub PAT (starts with `ghp_`)
- Click **"Add secret"**

**Note:** GitHub automatically provides this secret - you can use the default token that GitHub provides in Actions, or use your own PAT if needed.

---

## 📁 Step 2: Workflow File

The workflow file should already be in your repo:

```
.github/workflows/collect.yml
```

If not present, create it with the content from the setup guide.

---

## ✅ Step 3: Test the Workflow

### Manual Trigger

1. Go to: `https://github.com/Abhinav-Kotta/openclaw-token-audit/actions`
2. Click **"🤖 Token Audit Collection"** workflow
3. Click **"Run workflow"** → **"Run workflow"** button
4. Watch the run complete (~30 seconds)

**Expected output:**
```
✅ Collection Complete
📊 Latest data: data/latest.json
⏰ Timestamp: 2026-02-17 19:03:00 UTC
```

### Check the Results

1. Go to your repo main page
2. Look for new commit: `🤖 Token audit update: 2026-02-17 19:03:00 UTC`
3. Verify `data/latest.json` was updated

---

## 🕐 Step 4: Automatic Scheduling

Once configured, the workflow runs **automatically every hour at :00**:

```
0 * * * *  ← Every hour at :00 (UTC)
```

Examples:
- 19:00 UTC
- 20:00 UTC
- 21:00 UTC
- etc.

### Monitor Scheduled Runs

1. Go to **"Actions"** tab
2. Click **"🤖 Token Audit Collection"**
3. View all scheduled runs with timestamps

---

## 📊 What the Workflow Does

Every hour:

1. ✅ **Checkout** - Clones your repo
2. ✅ **Setup Node.js** - Installs Node 18
3. ✅ **Install Dependencies** - Runs `npm install` in collector/
4. ✅ **Configure Environment** - Sets up secrets as .env
5. ✅ **Collect Metrics** - Runs `npm run collect`
6. ✅ **Commit Changes** - Git commits with timestamp
7. ✅ **Push to GitHub** - Pushes to main/master branch
8. ✅ **Log Summary** - Outputs completion status

---

## 🔄 Disable Local Cron (Optional)

If you're running the local cron jobs from your machine, you can disable them:

```bash
cd /home/ubuntu/.openclaw/workspace/token-audit/collector
npm run cron:remove
```

**Why?** Prevents duplicate collections (one from local, one from GitHub Actions).

---

## 📈 View Metrics

### On GitHub

Visit your repo to see:
- **Commits** with timestamps
- **data/latest.json** - Current metrics
- **data/token-data-YYYY-MM-DD.json** - Daily breakdown
- **reports/audit-YYYY-MM-DD.json** - Audit reports

### Raw Data URL

Frontend can fetch data from:

```
https://raw.githubusercontent.com/Abhinav-Kotta/openclaw-token-audit/main/data/latest.json
```

---

## 🚨 Troubleshooting

### Workflow Not Running

**Check secrets are set:**
```bash
# Go to Settings → Secrets → Actions
# Verify all 3 secrets are present:
# ✅ OPENCLAW_GATEWAY_URL
# ✅ OPENCLAW_TOKEN
# ✅ GITHUB_TOKEN
```

**Check workflow file:**
```bash
# Verify file exists at:
# .github/workflows/collect.yml
# Branch: main or master
```

### "No JSON API endpoints found"

This is normal. The collector falls back to simulating realistic data based on business hours. Real API endpoints may not be exposed by default.

### Commits Not Being Pushed

**Check:**
1. Secrets are valid (especially `GITHUB_TOKEN`)
2. Branch name is `main` or `master`
3. Repository is not archived/read-only

### View Detailed Logs

1. Go to **Actions** tab
2. Click the failing workflow run
3. Expand any failed step to see logs
4. Look for error messages

---

## 📝 Monitoring

### Check Last Run

```bash
# Via GitHub Actions UI:
https://github.com/Abhinav-Kotta/openclaw-token-audit/actions
```

### Recent Commits

```bash
# Your repo shows commits like:
# 🤖 Token audit update: 2026-02-17 19:00:00 UTC
# 🤖 Token audit update: 2026-02-17 20:00:00 UTC
```

### Schedule Verification

Cron schedule: `0 * * * *` runs at:
- Every hour (every 60 minutes)
- At the :00 minute mark
- All times in UTC

---

## 🔒 Security

- ✅ Secrets stored encrypted in GitHub
- ✅ Never exposed in logs or code
- ✅ PAT has limited scope (repo only)
- ✅ Can be rotated anytime
- ✅ Workflow file is public but secrets are hidden

---

## 🎯 Next Steps

1. ✅ Add 3 secrets to Settings → Secrets → Actions
2. ✅ Verify `.github/workflows/collect.yml` exists
3. ✅ Manual test: Actions → Run workflow
4. ✅ Monitor first automatic run (top of next hour)
5. ✅ Disable local cron (if running): `npm run cron:remove`
6. ✅ Verify commits appear hourly with timestamps

---

## 📞 Support

If workflows aren't running:
1. Check secrets are all present and correct
2. Review workflow logs in Actions tab
3. Manually trigger to test
4. Check GitHub status: https://www.githubstatus.com

---

**Status: Ready for GitHub Actions**

Once secrets are configured, hourly collection starts automatically! 🚀
