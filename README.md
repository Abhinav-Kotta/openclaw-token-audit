# 🌸 OpenClaw Token Audit Dashboard

Beautiful anime-style dashboard for tracking OpenClaw token usage with comprehensive analytics.

## Components
- **Collector**: Node.js service for token data collection
- **Dashboard**: Next.js app with peachy anime aesthetic  
- **Automation**: Nightly GitHub pushes and optimization tracking

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Abhinav-Kotta/openclaw-token-audit)

## Local Development

```bash
# Clone and install
git clone https://github.com/Abhinav-Kotta/openclaw-token-audit
cd openclaw-token-audit
npm install

# Configure environment
cp .env.example .env
# Edit .env with your OpenClaw Gateway settings

# Start collector (background data collection)
npm run collector

# Start dashboard (development)
npm run dev
```

## Deployment

This project is optimized for Vercel deployment with zero configuration. The dashboard will automatically build and deploy, while the collector can run as a separate service or cron job.

## Features

- 🎌 Anime-themed UI with beautiful visualizations
- 📊 Real-time token usage tracking
- 🔄 Automated data collection and archival
- 📈 Historical usage analytics
- 🚀 One-click Vercel deployment