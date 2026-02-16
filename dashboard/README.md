# OpenClaw Token Audit Dashboard

A modern, anime-themed Next.js dashboard for monitoring OpenClaw token usage and analytics with real-time data visualization.

## 🌟 Features

- **Real-time Analytics**: Live token usage monitoring with auto-refresh
- **Anime-themed UI**: Beautiful gradient designs with smooth animations
- **Responsive Charts**: Interactive visualizations using Recharts
- **Session Tracking**: Detailed session information and agent analytics
- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Vercel Ready**: Optimized for seamless deployment to Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd dashboard
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📊 Data Sources

The dashboard reads token usage data from the collector service located at:
- `../collector/data/latest.json` (primary)
- Falls back to mock data if collector data is unavailable

### Expected Data Format

```json
{
  "sessions": [...],
  "tools": {...},
  "agents": {...},
  "channels": {...},
  "tokenUsage": {
    "daily": {...},
    "hourly": {...},
    "total": {...}
  }
}
```

## 🎨 UI Components

### StatsCard
Animated statistics cards with trend indicators and glow effects.

### TokenChart
Interactive area/line charts showing token usage over time.

### SessionsTable
Responsive table displaying recent sessions with filtering.

### Header
Navigation header with refresh functionality and notifications.

## 🎭 Anime Theme

The dashboard features a carefully crafted anime aesthetic:

- **Color Palette**: Pink/Blue/Yellow gradient scheme
- **Typography**: Inter font with JetBrains Mono for numbers
- **Animations**: Framer Motion for smooth transitions
- **Effects**: Glow, float, and pulse animations

### Color Scheme

```css
--primary: Pink (#ec4899)
--secondary: Blue (#0ea5e9)  
--accent: Yellow (#facc15)
--background: Dark gradients
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_APP_NAME="OpenClaw Token Audit"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Next.js Configuration

Key features in `next.config.js`:
- Standalone output for deployment
- CORS headers for API routes
- Automatic redirects
- Image optimization

## 📱 Responsive Design

The dashboard is fully responsive with:
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure build settings**:
   - Framework: Next.js
   - Root Directory: `dashboard`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Deploy**
   Vercel will automatically deploy on git push.

### Manual Deployment

```bash
npm run build
npm start
```

Or export static files:

```bash
npm run export
```

## 🔌 API Routes

### GET /api/token-data

Returns current token usage statistics.

**Response:**
```json
{
  "sessions": [...],
  "tokenUsage": {...},
  "agents": {...},
  "channels": {...}
}
```

**Error Handling:**
- Graceful fallback to mock data
- CORS enabled
- Error details in development

## 🎯 Performance

### Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Built-in Next.js features
- **Bundle Analysis**: Use `npm run analyze`
- **Caching**: Aggressive API response caching
- **Lazy Loading**: Components loaded on demand

### Monitoring

Built-in performance monitoring:
- Core Web Vitals tracking
- Real User Monitoring ready
- Performance profiling in dev mode

## 🧪 Development

### Project Structure

```
dashboard/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard page
│   └── layout.tsx         # Root layout
├── components/            # React components
├── styles/               # Global CSS
├── public/               # Static assets
└── lib/                  # Utility functions
```

### Code Style

- **TypeScript**: Strict type checking
- **ESLint**: Next.js recommended rules
- **Prettier**: Automatic formatting
- **Conventional Commits**: Standardized commit messages

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 🎨 Customization

### Themes

Modify colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...},
      accent: {...}
    }
  }
}
```

### Components

All components are modular and customizable:
- Props-based configuration
- CSS classes via Tailwind
- Animation controls via Framer Motion

## 📚 Dependencies

### Core
- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript**: Type safety

### UI & Styling  
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Recharts**: Chart library

### Utilities
- **date-fns**: Date manipulation
- **clsx**: Conditional classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the OpenClaw ecosystem.

## 📞 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the OpenClaw team

---

Built with ❤️ for the OpenClaw ecosystem