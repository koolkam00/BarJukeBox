# BarJukebox Export Package

## 📦 Complete File List for Cursor

Copy these files from Figma Make to your Cursor project:

### 🎯 Core Application Files
```
src/App.tsx                              # Main router and landing page
src/components/patron-app.tsx            # Complete patron application
src/components/admin-panel.tsx           # Complete admin application  
src/components/tv-display.tsx            # Complete TV display
src/components/design-gallery.tsx        # Design gallery for Figma reference
```

### 📱 Patron App Components
```
src/components/patron/patron-onboarding.tsx    # Welcome & QR scanner
src/components/patron/patron-discover.tsx      # Song discovery & search
src/components/patron/song-detail.tsx          # Individual song pages
src/components/patron/patron-queue.tsx         # Queue view with ETAs
src/components/patron/patron-account.tsx       # User profile & settings
src/components/patron/apple-pay-sheet.tsx      # Apple Pay integration
src/components/patron/bottom-navigation.tsx    # Mobile navigation
```

### 🛡️ Admin Panel Components  
```
src/components/admin/admin-login.tsx           # Secure admin login
src/components/admin/admin-dashboard.tsx       # Main control center
src/components/admin/admin-pricing.tsx         # Dynamic pricing controls
src/components/admin/admin-analytics.tsx       # Revenue & usage analytics
src/components/admin/admin-devices.tsx         # Device management
src/components/admin/admin-sidebar.tsx         # Admin navigation
```

### 🎨 UI Components (shadcn/ui)
```
src/components/ui/accordion.tsx
src/components/ui/alert-dialog.tsx
src/components/ui/alert.tsx
src/components/ui/aspect-ratio.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/breadcrumb.tsx
src/components/ui/button.tsx
src/components/ui/calendar.tsx
src/components/ui/card.tsx
src/components/ui/carousel.tsx
src/components/ui/chart.tsx
src/components/ui/checkbox.tsx
src/components/ui/collapsible.tsx
src/components/ui/command.tsx
src/components/ui/context-menu.tsx
src/components/ui/dialog.tsx
src/components/ui/drawer.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/form.tsx
src/components/ui/hover-card.tsx
src/components/ui/input-otp.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/menubar.tsx
src/components/ui/navigation-menu.tsx
src/components/ui/pagination.tsx
src/components/ui/popover.tsx
src/components/ui/progress.tsx
src/components/ui/radio-group.tsx
src/components/ui/resizable.tsx
src/components/ui/scroll-area.tsx
src/components/ui/select.tsx
src/components/ui/separator.tsx
src/components/ui/sheet.tsx
src/components/ui/sidebar.tsx
src/components/ui/skeleton.tsx
src/components/ui/slider.tsx
src/components/ui/sonner.tsx
src/components/ui/switch.tsx
src/components/ui/table.tsx
src/components/ui/tabs.tsx
src/components/ui/textarea.tsx
src/components/ui/toggle-group.tsx
src/components/ui/toggle.tsx
src/components/ui/tooltip.tsx
src/components/ui/use-mobile.ts
src/components/ui/utils.ts
```

### 🎨 Styles & Configuration
```
src/styles/globals.css                   # Complete design system
tailwind.config.js                      # Tailwind configuration
```

### 🗄️ Backend (Optional - for real-time features)
```
src/utils/supabase/info.tsx             # Supabase configuration
supabase/functions/server/index.tsx     # Server functions
supabase/functions/server/kv_store.tsx  # Database utilities
```

### 📚 Documentation
```
README.md                               # Project overview
CURSOR_SETUP.md                         # Complete setup guide
```

## 🚀 Quick Copy-Paste Process

### Step 1: Create React App
```bash
npx create-react-app barjukebox --template typescript
cd barjukebox
```

### Step 2: Install All Dependencies
```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-sheet @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip lucide-react class-variance-authority clsx tailwind-merge recharts motion react-hook-form@7.55.0 @hookform/resolvers zod sonner@2.0.3 qrcode.react html5-qrcode date-fns @supabase/supabase-js

npm install --save-dev @types/qrcode.react tailwindcss @tailwindcss/forms @tailwindcss/typography autoprefixer postcss
```

### Step 3: Setup File Structure
Create these directories in your `src` folder:
```
src/
├── components/
│   ├── admin/
│   ├── patron/
│   └── ui/
├── styles/
└── utils/
    └── supabase/
```

### Step 4: Copy Files
1. Copy each file from the list above
2. Remove `.tsx` extensions from imports
3. Update relative paths as needed
4. Replace `src/styles/globals.css` with the design system
5. Replace `src/App.tsx` with the main router

### Step 5: Configure Tailwind
Update your `tailwind.config.js` with the configuration from CURSOR_SETUP.md

### Step 6: Import Global Styles  
In your `src/index.tsx`, add:
```typescript
import './styles/globals.css'
```

## 🎯 What You'll Get

After copying all files, you'll have:

- **Complete BarJukebox System**: All 3 applications working locally
- **Design Gallery**: Perfect reference for creating Figma files  
- **12+ Pre-built Screens**: Ready for customization
- **Real-time Features**: Optional Supabase integration
- **Mobile-First Design**: Optimized for all devices
- **Professional UI**: shadcn/ui component library
- **Type Safety**: Full TypeScript support

## 📱 Test Your Setup

Run these commands to verify everything works:
```bash
npm start
```

Then test these URLs:
- `http://localhost:3000` (landing page)
- `http://localhost:3000?app=patron` (mobile app)
- `http://localhost:3000?app=admin` (admin panel)
- `http://localhost:3000?app=tv` (TV display)
- `http://localhost:3000?app=gallery` (design gallery)

## 🎨 Design Gallery Usage

The Design Gallery (`?app=gallery`) shows you:
- All 12+ individual screens
- Exact dimensions for Figma (375×667px mobile, 1200×800px desktop)
- Component breakdowns
- Visual references for recreating in Figma

Perfect for creating your own editable Figma design files!

## 🔧 Customization Ready

Once in Cursor, you can:
- Use Cursor's AI to modify any component
- Add new features with AI assistance  
- Customize the design system in globals.css
- Deploy to any React hosting platform
- Scale the system for production use

The entire codebase is now yours to own and modify! 🚀