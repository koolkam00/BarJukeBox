# 📋 Complete Export Checklist for Cursor

## ✅ Step-by-Step Export Process

### 1. Initial Setup
```bash
npx create-react-app barjukebox --template typescript
cd barjukebox
```

### 2. Replace package.json
- [ ] Copy `package.json.template` to `package.json`
- [ ] Run `npm install`

### 3. Setup Tailwind
- [ ] Copy `tailwind.config.js.template` to `tailwind.config.js`
- [ ] Create `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. Copy Core Files (CRITICAL)

#### Main Application Files
- [ ] `src/App.tsx` → Replace the default App.tsx
- [ ] `src/components/patron-app.tsx`
- [ ] `src/components/admin-panel.tsx`
- [ ] `src/components/tv-display.tsx`
- [ ] `src/components/design-gallery.tsx`

#### Styles
- [ ] `src/styles/globals.css` → Create directory and copy file
- [ ] Update `src/index.tsx` to import: `import './styles/globals.css'`

### 5. Copy All Component Directories

#### Patron Components (7 files)
- [ ] Create `src/components/patron/` directory
- [ ] `src/components/patron/patron-onboarding.tsx`
- [ ] `src/components/patron/patron-discover.tsx`
- [ ] `src/components/patron/song-detail.tsx`
- [ ] `src/components/patron/patron-queue.tsx`
- [ ] `src/components/patron/patron-account.tsx`
- [ ] `src/components/patron/apple-pay-sheet.tsx`
- [ ] `src/components/patron/bottom-navigation.tsx`

#### Admin Components (6 files)
- [ ] Create `src/components/admin/` directory
- [ ] `src/components/admin/admin-login.tsx`
- [ ] `src/components/admin/admin-dashboard.tsx`
- [ ] `src/components/admin/admin-pricing.tsx`
- [ ] `src/components/admin/admin-analytics.tsx`
- [ ] `src/components/admin/admin-devices.tsx`
- [ ] `src/components/admin/admin-sidebar.tsx`

#### UI Components (38 files)
- [ ] Create `src/components/ui/` directory
- [ ] `src/components/ui/accordion.tsx`
- [ ] `src/components/ui/alert-dialog.tsx`
- [ ] `src/components/ui/alert.tsx`
- [ ] `src/components/ui/aspect-ratio.tsx`
- [ ] `src/components/ui/avatar.tsx`
- [ ] `src/components/ui/badge.tsx`
- [ ] `src/components/ui/breadcrumb.tsx`
- [ ] `src/components/ui/button.tsx`
- [ ] `src/components/ui/calendar.tsx`
- [ ] `src/components/ui/card.tsx`
- [ ] `src/components/ui/carousel.tsx`
- [ ] `src/components/ui/chart.tsx`
- [ ] `src/components/ui/checkbox.tsx`
- [ ] `src/components/ui/collapsible.tsx`
- [ ] `src/components/ui/command.tsx`
- [ ] `src/components/ui/context-menu.tsx`
- [ ] `src/components/ui/dialog.tsx`
- [ ] `src/components/ui/drawer.tsx`
- [ ] `src/components/ui/dropdown-menu.tsx`
- [ ] `src/components/ui/form.tsx`
- [ ] `src/components/ui/hover-card.tsx`
- [ ] `src/components/ui/input-otp.tsx`
- [ ] `src/components/ui/input.tsx`
- [ ] `src/components/ui/label.tsx`
- [ ] `src/components/ui/menubar.tsx`
- [ ] `src/components/ui/navigation-menu.tsx`
- [ ] `src/components/ui/pagination.tsx`
- [ ] `src/components/ui/popover.tsx`
- [ ] `src/components/ui/progress.tsx`
- [ ] `src/components/ui/radio-group.tsx`
- [ ] `src/components/ui/resizable.tsx`
- [ ] `src/components/ui/scroll-area.tsx`
- [ ] `src/components/ui/select.tsx`
- [ ] `src/components/ui/separator.tsx`
- [ ] `src/components/ui/sheet.tsx`
- [ ] `src/components/ui/sidebar.tsx`
- [ ] `src/components/ui/skeleton.tsx`
- [ ] `src/components/ui/slider.tsx`
- [ ] `src/components/ui/sonner.tsx`
- [ ] `src/components/ui/switch.tsx`
- [ ] `src/components/ui/table.tsx`
- [ ] `src/components/ui/tabs.tsx`
- [ ] `src/components/ui/textarea.tsx`
- [ ] `src/components/ui/toggle-group.tsx`
- [ ] `src/components/ui/toggle.tsx`
- [ ] `src/components/ui/tooltip.tsx`
- [ ] `src/components/ui/use-mobile.ts`
- [ ] `src/components/ui/utils.ts`

### 6. Backend Setup (Optional)
- [ ] Create `src/utils/supabase/` directory
- [ ] `src/utils/supabase/info.tsx`
- [ ] Create `supabase/functions/server/` directory
- [ ] `supabase/functions/server/index.tsx`
- [ ] `supabase/functions/server/kv_store.tsx`

### 7. Documentation
- [ ] `README.md`
- [ ] `CURSOR_SETUP.md`
- [ ] `EXPORT_PACKAGE.md`

### 8. Fix Import Paths

In ALL copied files, change:
```typescript
// FROM this format:
import { Component } from './components/component.tsx'

// TO this format:
import { Component } from './components/component'
```

**Critical imports to fix:**
- Remove ALL `.tsx` extensions from imports
- Ensure relative paths are correct (`./` for same directory, `../` for parent)

### 9. Test Installation

Run these commands:
```bash
npm start
```

Test all routes:
- [ ] `http://localhost:3000` (landing page works)
- [ ] `http://localhost:3000?app=patron` (patron app loads)
- [ ] `http://localhost:3000?app=admin` (admin panel loads)
- [ ] `http://localhost:3000?app=tv` (TV display loads)
- [ ] `http://localhost:3000?app=gallery` (design gallery loads)

### 10. Verify Features

#### Landing Page
- [ ] All 4 application cards visible
- [ ] Navigation buttons work
- [ ] "Open in New Tab" buttons work

#### Patron App  
- [ ] Onboarding screen loads
- [ ] Song discovery/search works
- [ ] Navigation between screens works
- [ ] UI components render properly

#### Admin Panel
- [ ] Login screen loads
- [ ] Dashboard interface works
- [ ] Sidebar navigation works
- [ ] Charts and analytics display

#### TV Display
- [ ] Full-screen layout works
- [ ] QR code displays
- [ ] Now playing interface shows

#### Design Gallery
- [ ] All screen thumbnails load
- [ ] Category tabs work
- [ ] Screen viewer modal works
- [ ] All 12+ screens are visible

## 🎯 Final Verification

You should have:
- ✅ **Complete BarJukebox System**: All 3 apps working
- ✅ **61 Total Component Files**: Patron (7) + Admin (6) + UI (38) + Core (4) + Other (6)
- ✅ **Professional Design System**: Tailwind + Custom CSS variables
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Real-time Ready**: Supabase integration prepared
- ✅ **Design Reference**: Complete gallery for Figma recreation

## 🚨 Common Issues & Fixes

**Build Errors?**
- Check that all `.tsx` extensions are removed from imports
- Verify all packages from package.json are installed
- Ensure globals.css is imported in index.tsx

**Missing Components?**
- Double-check you copied all 61 files from the checklist
- Verify directory structure matches exactly
- Check for typos in file names

**Styling Issues?**
- Confirm tailwind.config.js is set up correctly
- Verify globals.css contains the complete design system
- Check that Tailwind is processing CSS properly

## 🎉 Success!

Once all checkboxes are complete, you'll have the complete BarJukebox system running locally in Cursor, ready for customization and deployment!

The Design Gallery (`?app=gallery`) will give you perfect visual references for creating your own Figma design files. 🎨