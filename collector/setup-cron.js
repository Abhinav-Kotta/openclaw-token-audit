#!/usr/bin/env node

/**
 * Cron Setup Script
 * 
 * Sets up automated token collection via cron jobs
 * 
 * Usage:
 *   node setup-cron.js --install    # Install cron jobs
 *   node setup-cron.js --remove     # Remove cron jobs
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

class CronSetup {
  constructor() {
    this.collectorPath = __dirname;
    this.cronJobId = 'openclaw-token-collector';
    this.cronTag = `# ${this.cronJobId}`;
  }

  installCronJobs() {
    console.log('\n🔧 Installing cron jobs...\n');

    const collectScript = path.join(this.collectorPath, 'run-collector.js');
    const logFile = path.join(this.collectorPath, 'data', 'cron.log');

    // Create cron entries
    const cronEntries = [
      {
        name: 'Every hour - Collect & Push to GitHub',
        schedule: '0 * * * *',
        command: `cd ${this.collectorPath} && npm run collect:and:push >> ${logFile} 2>&1`
      },
      {
        name: 'Daily audit report at 00:00',
        schedule: '0 0 * * *',
        command: `cd ${this.collectorPath} && node daily-audit.js >> ${logFile} 2>&1`
      }
    ];

    console.log('📋 Cron jobs to be installed:\n');
    cronEntries.forEach(entry => {
      console.log(`  [${entry.schedule}] ${entry.name}`);
      console.log(`    ${entry.command}\n`);
    });

    // Create the cron entries
    const cronContent = cronEntries.map(entry => 
      `${entry.schedule} ${entry.command} ${this.cronTag}`
    ).join('\n');

    try {
      // Get current crontab
      let currentCrontab = '';
      try {
        currentCrontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf8' });
      } catch (e) {
        // No crontab exists yet
        currentCrontab = '';
      }

      // Remove existing entries
      const filtered = currentCrontab
        .split('\n')
        .filter(line => !line.includes(this.cronTag))
        .join('\n')
        .trim();

      // Add new entries
      const newCrontab = filtered ? `${filtered}\n\n${cronContent}` : cronContent;

      // Write to temp file and install
      const tempFile = `/tmp/crontab-${Date.now()}.txt`;
      fs.writeFileSync(tempFile, newCrontab + '\n');

      execSync(`crontab ${tempFile}`, { encoding: 'utf8' });
      fs.unlinkSync(tempFile);

      console.log('✅ Cron jobs installed successfully!\n');
      console.log('📊 View installed jobs:');
      console.log('   crontab -l\n');
      console.log('📊 View logs:');
      console.log(`   tail -f ${logFile}\n`);

    } catch (error) {
      console.error(`❌ Failed to install cron jobs: ${error.message}`);
      console.error('\n💡 Manual installation:');
      console.error('   1. Run: crontab -e');
      console.error('   2. Add these lines:\n');
      cronEntries.forEach(entry => {
        console.error(`      ${entry.schedule} cd ${this.collectorPath} && node run-collector.js >> ${logFile} 2>&1`);
      });
      process.exit(1);
    }
  }

  removeCronJobs() {
    console.log('\n🗑️  Removing cron jobs...\n');

    try {
      let currentCrontab = '';
      try {
        currentCrontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf8' });
      } catch (e) {
        console.log('ℹ️  No crontab found');
        return;
      }

      // Remove our entries
      const filtered = currentCrontab
        .split('\n')
        .filter(line => !line.includes(this.cronTag))
        .join('\n')
        .trim();

      if (filtered) {
        const tempFile = `/tmp/crontab-${Date.now()}.txt`;
        fs.writeFileSync(tempFile, filtered + '\n');
        execSync(`crontab ${tempFile}`, { encoding: 'utf8' });
        fs.unlinkSync(tempFile);
      } else {
        execSync('crontab -r 2>/dev/null || true', { encoding: 'utf8' });
      }

      console.log('✅ Cron jobs removed successfully!\n');

    } catch (error) {
      console.error(`❌ Failed to remove cron jobs: ${error.message}`);
      process.exit(1);
    }
  }

  listCronJobs() {
    console.log('\n📋 Current cron jobs:\n');
    try {
      const crontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf8' });
      const lines = crontab.split('\n').filter(line => line.includes(this.cronTag));
      if (lines.length === 0) {
        console.log('   No token collector jobs found');
      } else {
        lines.forEach((line, i) => {
          console.log(`   ${i + 1}. ${line.replace(this.cronTag, '').trim()}`);
        });
      }
    } catch (e) {
      console.log('   No crontab found');
    }
    console.log();
  }

  run(args = []) {
    if (args.includes('--install')) {
      this.installCronJobs();
    } else if (args.includes('--remove')) {
      this.removeCronJobs();
    } else if (args.includes('--list')) {
      this.listCronJobs();
    } else {
      console.log('\n🤖 Token Collector Cron Setup\n');
      console.log('Usage:');
      console.log('   node setup-cron.js --install   Install cron jobs');
      console.log('   node setup-cron.js --remove    Remove cron jobs');
      console.log('   node setup-cron.js --list      List current jobs\n');
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const setup = new CronSetup();
  setup.run(process.argv.slice(2));
}

module.exports = CronSetup;
