# BarJukebox - Cursor Setup Guide

This guide will help you set up the complete BarJukebox application in Cursor for local development.

## 🚀 Quick Setup

### 1. Create New React Project
```bash
npx create-react-app barjukebox --template typescript
cd barjukebox
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install react react-dom typescript

# UI Components (shadcn/ui dependencies)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-sheet @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Icons and utilities
npm install lucide-react class-variance-authority clsx tailwind-merge

# Charts and animations
npm install recharts motion

# Form handling
npm install react-hook-form@7.55.0 @hookform/resolvers zod

# Toast notifications
npm install sonner@2.0.3

# QR Code functionality
npm install qrcode.react html5-qrcode

# Date utilities
npm install date-fns

# Backend (Supabase)
npm install @supabase/supabase-js

# Development dependencies
npm install --save-dev @types/qrcode.react tailwindcss @tailwindcss/forms @tailwindcss/typography autoprefixer postcss
```

### 3. Setup Tailwind CSS
```bash
npx tailwindcss init -p
```

### 4. File Structure to Create
```
src/
├── App.tsx                    # Main application router
├── components/
│   ├── admin/                 # Admin panel components
│   ├── patron/                # Patron app components  
│   ├── ui/                    # shadcn/ui components
│   ├── admin-panel.tsx        # Admin panel main component
│   ├── patron-app.tsx         # Patron app main component
│   ├── tv-display.tsx         # TV display component
│   └── design-gallery.tsx     # Design gallery component
├── styles/
│   └── globals.css            # Global styles and design tokens
├── utils/
│   └── supabase/
│       └── info.tsx           # Supabase configuration
└── supabase/
    └── functions/
        └── server/            # Backend server functions
```

## 📁 Files to Copy

Copy all the files from this Figma Make project into your Cursor project:

### Core Application Files
- `src/App.tsx` (main router)
- `src/components/patron-app.tsx`
- `src/components/admin-panel.tsx` 
- `src/components/tv-display.tsx`
- `src/components/design-gallery.tsx`

### Component Directories
- `src/components/admin/` (all admin components)
- `src/components/patron/` (all patron components)
- `src/components/ui/` (all shadcn/ui components)

### Configuration Files
- `src/styles/globals.css` (design system)
- `src/utils/supabase/info.tsx` (if using backend)
- `tailwind.config.js` (see below)

## ⚙️ Configuration Files

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### package.json additions
Add these scripts to your package.json:
```json
{
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## 🔧 Setup Steps

1. **Create the project structure** as shown above
2. **Copy all component files** from this Figma Make project
3. **Update import paths** - Remove `.tsx` extensions and use relative paths
4. **Replace globals.css** with the provided design system CSS
5. **Configure Tailwind** with the config above
6. **Test the application** by running `npm start`

## 🎨 Import Path Updates

When copying files, update these import patterns:

```typescript
// From Figma Make format:
import { Component } from './components/component.tsx'

// To standard React format:  
import { Component } from './components/component'
```

## 🗄️ Backend Setup (Optional)

If you want to use the Supabase backend:

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create `.env.local`:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Update `src/utils/supabase/info.tsx` with your credentials

## 🚀 Running the Application

```bash
npm start
```

The app will open at http://localhost:3000

### Available Routes:
- `http://localhost:3000` - Landing page
- `http://localhost:3000?app=patron` - Patron mobile app
- `http://localhost:3000?app=admin` - Admin panel  
- `http://localhost:3000?app=tv` - TV display
- `http://localhost:3000?app=gallery` - Design gallery

## 🎯 What You'll Have

A complete, functional BarJukebox application with:
- ✅ Mobile-first patron app
- ✅ Desktop admin panel
- ✅ TV display interface  
- ✅ Design gallery for Figma reference
- ✅ Real-time features (with Supabase)
- ✅ Apple Pay integration ready
- ✅ Responsive design system
- ✅ 12+ pre-built screens

## 🔍 Troubleshooting

**Missing dependencies?**
- Check that all packages from the install step are added
- Some shadcn/ui components may need additional @radix-ui packages

**Import errors?**
- Remove `.tsx` extensions from imports
- Use relative paths (`./ ` for same directory, `../` for parent)

**Styling issues?**
- Ensure globals.css is imported in index.tsx or App.tsx
- Verify Tailwind config matches the provided setup

## 📚 Next Steps

Once set up in Cursor, you can:
- Customize the design system in `globals.css`
- Add new features to any of the three applications
- Modify components using Cursor's AI assistance
- Deploy to Vercel, Netlify, or any React hosting platform
- Create your own Figma files using the Design Gallery as reference

The entire codebase is now yours to modify and extend!