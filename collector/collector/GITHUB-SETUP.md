# 🚀 GitHub Integration Setup

## Overview

The token collector now automatically pushes data to GitHub every hour. This allows you to:
- 📊 View token usage history in your GitHub repo
- 🔄 Track metrics over time with git commit history
- 📈 Build reports and visualizations from historical data
- 🌐 Access data from frontend dashboards

---

## ⚙️ Configuration (Required)

### 1. Create a GitHub Personal Access Token (PAT)

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `openclaw-token-collector`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### 2. Create a GitHub Repository

1. Go to: https://github.com/new
2. Create a repository: `token-audit-data`
3. Initialize with README (optional)
4. Make it **Private** (recommended - contains usage data)

### 3. Configure .env

Edit `/home/ubuntu/.openclaw/workspace/token-audit/collector/.env`:

```env
# OpenClaw Gateway
OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_TOKEN=your_token_here

# GitHub Configuration
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXX
GITHUB_REPO_OWNER=your_github_username
GITHUB_REPO_NAME=token-audit-data
```

**Replace with your values:**
- `GITHUB_TOKEN` - Your PAT from step 1
- `GITHUB_REPO_OWNER` - Your GitHub username (e.g., `abhinav`)
- `GITHUB_REPO_NAME` - Repository name (e.g., `token-audit-data`)

---

## ✅ Verification

### Test Push Manually

```bash
cd /home/ubuntu/.openclaw/workspace/token-audit/collector
npm run collect:and:push
```

**Expected output:**
```
📤 Pushing data to GitHub...
✅ Git repository initialized
📝 Staging files...
📌 Committing: "🤖 Token audit update: 02/17/2026 18:52:30"
🚀 Pushing to GitHub...
✅ Data pushed successfully!
📊 View on GitHub:
   https://github.com/your_username/token-audit-data
```

### View Cron Status

```bash
npm run cron:list
```

Should show:
```
1. 0 * * * * ... npm run collect:and:push ...
2. 0 0 * * * ... npm run audit ...
```

### Monitor Logs

```bash
tail -f /home/ubuntu/.openclaw/workspace/token-audit/collector/data/cron.log
```

---

## 📊 What Gets Pushed

Every hour, the following files are committed to GitHub:

```
data/
├── latest.json           ← Current metrics snapshot
├── token-data-YYYY-MM-DD.json  ← Daily breakdown
└── cron.log             ← Collection logs

reports/
└── audit-YYYY-MM-DD.json ← Daily audit reports
```

### Example: latest.json Structure

```json
{
  "sessions": 8,
  "tokenUsage": {
    "total": {
      "tokensIn": 17072,
      "tokensOut": 27831,
      "context": 4781
    }
  },
  "agents": {
    "claude-haiku-4-5": 2,
    "claude-sonnet-4-5": 1
  },
  "channels": {
    "webchat": 3,
    "slack": 2
  }
}
```

---

## 🔄 Automation Schedule

### Hourly (0 * * * *)
```bash
npm run collect:and:push
```
- Fetches fresh metrics from OpenClaw gateway
- Pushes to GitHub with timestamped commit
- Updates `latest.json` in your repo

### Daily at Midnight (0 0 * * *)
```bash
npm run audit
```
- Generates comprehensive audit report
- Saves as `audit-YYYY-MM-DD.json`
- Captures daily statistics

---

## 🔗 Accessing Data

### View in GitHub

After first push, visit:
```
https://github.com/YOUR_USERNAME/token-audit-data
```

Commits appear with format: `🤖 Token audit update: MM/DD/YYYY HH:MM:SS`

### Use in Frontend

Your frontend can fetch raw data via GitHub Raw Content:

```javascript
const url = `https://raw.githubusercontent.com/YOUR_USERNAME/token-audit-data/main/data/latest.json`;
const data = await fetch(url).then(r => r.json());
```

---

## 🚨 Troubleshooting

### "Authentication Failed"
- ✅ Check GITHUB_TOKEN is valid and not expired
- ✅ Verify PAT has `repo` scope
- ✅ Token must start with `ghp_`

### "Repository Not Found"
- ✅ GITHUB_REPO_OWNER must be your username (not Full Name)
- ✅ GITHUB_REPO_NAME must exist on GitHub
- ✅ Verify case sensitivity

### "No Changes to Commit"
- ℹ️ Normal if no new metrics since last push
- ✅ New commits only created when data changes

### View Detailed Logs
```bash
tail -100 /home/ubuntu/.openclaw/workspace/token-audit/collector/data/cron.log
```

---

## 📋 Next Steps

1. ✅ Create GitHub PAT
2. ✅ Create `token-audit-data` repository
3. ✅ Update `.env` with credentials
4. ✅ Test: `npm run collect:and:push`
5. ✅ Verify cron jobs: `npm run cron:list`
6. ✅ Monitor: `tail -f data/cron.log`

---

## 🔒 Security Notes

- Keep GITHUB_TOKEN secret - never commit .env to git
- Use a machine/bot account token for production (optional)
- Consider making repo private to protect usage data
- Rotate token periodically (recommend yearly)

---

**Status: Ready for Hourly GitHub Sync**
