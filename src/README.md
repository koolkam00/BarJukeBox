# BarJukebox - Multi-Application System

BarJukebox is a comprehensive jukebox system with three distinct interfaces that can be accessed separately through URL parameters:

## 🎵 Patron App (`?app=patron`)
Mobile-first interface for customers to browse and select songs.

**Features:**
- QR code scanning to join sessions
- Song search and discovery
- Apple Pay integration
- Real-time queue viewing with ETAs
- Tip/boost functionality

**Access:**
- Direct URL: `?app=patron`
- With session: `?app=patron&session=your-session-id`

## 🛡️ Admin Panel (`?app=admin`)
Desktop interface for bar staff to manage the jukebox system.

**Features:**
- Queue management and controls
- Dynamic pricing settings
- Content filtering
- Analytics dashboard
- Device management

**Access:**
- Direct URL: `?app=admin`

## 📺 TV Display (`?app=tv`)
Full-screen display for public viewing in bars.

**Features:**
- Now playing screen
- Queue preview
- QR code for easy joining
- Real-time updates

**Access:**
- Direct URL: `?app=tv`
- With session: `?app=tv&session=your-session-id`

## 🎨 Design Gallery (`?app=gallery`)
Complete showcase of all UI screens and components for Figma reference.

**Features:**
- Visual gallery of all 12+ screens
- Organized by application category
- Screen dimensions and specifications
- Export guidelines for Figma recreation

**Access:**
- Direct URL: `?app=gallery`

## 🏠 Landing Page (default)
Central hub to launch any of the applications.

**Features:**
- Application launcher with descriptions
- Direct navigation to each app
- Option to open apps in new tabs
- Session parameter support

## How to Access Each Application

### Method 1: URL Parameters (Recommended)
Add URL parameters to access applications directly:
- Patron App: `/?app=patron`
- Admin Panel: `/?app=admin` 
- TV Display: `/?app=tv`

### Method 2: Landing Page Navigation
1. Open the main application (no parameters)
2. Click "Enter [App Name]" to navigate within the same tab
3. Click "Open in New Tab" to open the app in a separate tab

### Method 3: Direct Links
Each app can be bookmarked with its direct URL for instant access.

## Session Management

All applications support session parameters for real-time synchronization:
- Default session: `demo-session`
- Custom session: Add `&session=your-session-id` to any URL
- Sessions enable real-time sync between patron devices, admin panel, and TV display

## Architecture

```
├── App.tsx                   # Main router and landing page
├── components/
│   ├── patron-app.tsx        # Complete patron application
│   ├── admin-panel.tsx       # Complete admin application  
│   ├── tv-display.tsx        # Complete TV display application
│   ├── patron/               # Patron app components
│   ├── admin/                # Admin panel components
│   └── ui/                   # Shared UI components
├── supabase/                 # Backend integration
└── styles/                   # Global styles
```

## Backend Integration

All applications connect to the same Supabase backend for:
- Real-time queue synchronization
- User authentication (admin panel)
- Session management
- Analytics and reporting data

## Usage Examples

**For a bar setup:**
1. TV Display: `?app=tv&session=bar-main-floor`
2. Admin Panel: `?app=admin` (open on staff device)
3. Patron Access: QR code on TV directs to `?app=patron&session=bar-main-floor`

**For development/testing:**
1. Start at landing page (no parameters)
2. Navigate to desired application
3. Test real-time sync by opening multiple apps with same session ID

## Mobile Optimization

The patron app is fully optimized for mobile devices with:
- Touch-friendly interface
- Responsive design
- Dark mode for bar environments
- Quick song selection workflow
- Apple Pay integration