#!/usr/bin/env node

/**
 * Repository Push Script
 * 
 * Pushes collected token data to remote repository
 * 
 * Requires .env configuration:
 *   REPO_TOKEN=your_access_token
 *   REPO_OWNER=your_username
 *   REPO_NAME=your_repo_name
 * 
 * Usage:
 *   node push-to-github.js
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitHubPusher {
  constructor() {
    this.repoOwner = process.env.REPO_OWNER;
    this.repoName = process.env.REPO_NAME;
    this.repoToken = process.env.REPO_TOKEN;
    this.dataDir = path.join(__dirname, 'data');
    this.repoDir = path.join(__dirname, '.git') ? __dirname : null;
  }

  validate() {
    console.log('\n🔍 Validating Repository Configuration...\n');

    if (!this.repoOwner || this.repoOwner === 'optional') {
      console.error('❌ REPO_OWNER not configured in .env');
      console.error('   Set: REPO_OWNER=your_username\n');
      return false;
    }

    if (!this.repoName || this.repoName === 'optional') {
      console.error('❌ REPO_NAME not configured in .env');
      console.error('   Set: REPO_NAME=your_repo_name\n');
      return false;
    }

    if (!this.repoToken || this.repoToken === 'optional') {
      console.error('❌ REPO_TOKEN not configured in .env');
      console.error('   Set: REPO_TOKEN=your_access_token');
      console.error('   Get token from your repository provider\n');
      return false;
    }

    console.log(`✅ Repository Config:`);
    console.log(`   Owner: ${this.repoOwner}`);
    console.log(`   Repo: ${this.repoName}`);
    console.log(`   Token: ${this.repoToken ? '***configured***' : 'missing'}\n`);

    return true;
  }

  async push() {
    if (!this.validate()) {
      return false;
    }

    console.log('📤 Pushing data to GitHub...\n');

    try {
      const timestamp = new Date().toISOString();
      const shortTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Check if git repo exists
      if (!fs.existsSync(path.join(__dirname, '.git'))) {
        console.log('🔧 Initializing git repository...');
        execSync('git init', { cwd: __dirname, stdio: 'pipe' });
        
        // Add remote
        const remoteUrl = `https://${this.repoToken}@github.com/${this.repoOwner}/${this.repoName}.git`;
        execSync(`git remote add origin ${remoteUrl}`, { cwd: __dirname, stdio: 'pipe' });
        
        console.log('✅ Git repository initialized\n');
      }

      // Configure git user
      console.log('🔐 Configuring git user...');
      execSync('git config user.email "token-collector@openclaw.ai"', { cwd: __dirname, stdio: 'pipe' });
      execSync('git config user.name "Token Collector"', { cwd: __dirname, stdio: 'pipe' });

      // Stage data files
      console.log('📝 Staging files...');
      execSync('git add data/latest.json data/token-data-*.json reports/*.json 2>/dev/null || true', { 
        cwd: __dirname, 
        stdio: 'pipe' 
      });

      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { cwd: __dirname, encoding: 'utf8' });
      
      if (!status.trim()) {
        console.log('ℹ️  No changes to commit');
        return true;
      }

      // Commit
      const commitMessage = `🤖 Token audit update: ${shortTime}`;
      console.log(`📌 Committing: "${commitMessage}"`);
      execSync(`git commit -m "${commitMessage}"`, { cwd: __dirname, stdio: 'pipe' });

      // Push
      console.log('🚀 Pushing to GitHub...');
      execSync('git push -u origin main 2>/dev/null || git push -u origin master', { 
        cwd: __dirname, 
        stdio: 'pipe',
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: '0'
        }
      });

      console.log(`\n✅ Data pushed successfully!\n`);
      console.log(`📊 View on GitHub:`);
      console.log(`   https://github.com/${this.repoOwner}/${this.repoName}\n`);

      return true;

    } catch (error) {
      console.error(`\n❌ Push failed: ${error.message}\n`);
      
      if (error.message.includes('Authentication')) {
        console.error('💡 Check your REPO_TOKEN in .env');
      }
      
      return false;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const pusher = new GitHubPusher();
  pusher.push().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = GitHubPusher;
