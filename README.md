# Officience Landing Page

A modern React landing page for Officience - Flexible IT Outsourcing from Vietnam.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (via CDN)
- **Framer Motion** - Animations
- **React Three Fiber** - 3D graphics
- **Lucide React** - Icons

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
officience/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── Capabilities.tsx
│   ├── ClientStories.tsx
│   ├── HowWeEngage.tsx
│   ├── WhyOfficience.tsx
│   ├── Contact.tsx
│   ├── Survey.tsx      # Contact survey modal
│   └── Footer.tsx
├── public/             # Static assets
├── App.tsx             # Main app component
├── index.tsx           # Entry point
├── index.html          # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json         # Vercel configuration
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel via GitHub import.

## License

Proprietary - Officience
