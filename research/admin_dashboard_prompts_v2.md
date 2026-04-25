# Rapidry Admin Dashboard — End-to-End Build Prompts (v2)

> **How to use**: Copy-paste each prompt into your AI coding assistant **one at a time**, in order. Each prompt is self-contained. Complete one before starting the next.
>
> **Project**: `/Volumes/Crucial/LaundryApp-Project/admin-dashboard/`
> **Backend**: `/Volumes/Crucial/LaundryApp-Project/backend/`
> **Design Ref**: `/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/`

---

## PROMPT 1 — Backend: Admin Login + Missing Endpoints

```
I'm building an admin dashboard for my laundry platform (Rapidry). The backend is at:
/Volumes/Crucial/LaundryApp-Project/backend/

CURRENT STATE:
- backend/src/controllers/admin.controller.js — has: getDashboardStats, getAllOrders, getOrderDetail, assignAgent, getAllAgents, createAgent, suspendAgent, getAllCustomers, getAllPartners, createCoupon, getAllCoupons, updateServicePricing, getAnalytics
- backend/src/routes/admin.routes.js — all routes use authMiddleware + roleGuard('admin')
- backend/src/controllers/auth.controller.js — has verifyToken (Firebase phone OTP), getMe, updateProfile
- backend/src/utils/jwt.js — generateToken(userId, role) creates JWT with { userId, role }, verifyToken(token) verifies
- backend/src/controllers/service.controller.js — has getAllServices (from 'services' table), getServiceItems (from 'service_items' table)
- Users table has: id (UUID), firebase_uid, name, phone, email, role (customer/agent/admin/partner), avatar_url, is_active, created_at, updated_at
- Database: PostgreSQL via Knex, connection in backend/src/config/database.js

WHAT TO BUILD:

=== PART A: Admin Login ===

1. Install bcryptjs:
   cd /Volumes/Crucial/LaundryApp-Project/backend && npm install bcryptjs

2. Create migration: backend/db/migrations/016_add_password_hash_to_users.js
   - Add column: password_hash TEXT nullable to users table

3. Create seed: backend/db/seeds/004_admin_user.js
   - Upsert an admin user with:
     - firebase_uid: 'admin-dashboard-user'
     - name: 'Nayan Kumar'
     - phone: '+910000000000'
     - email: 'admin@rapidry.in'
     - role: 'admin'
     - password_hash: bcrypt hash of 'Rapidry@2026' (10 salt rounds)
     - is_active: true

4. Add adminLogin function in backend/src/controllers/auth.controller.js:
   - Accepts POST body: { email, password }
   - Validates both fields present
   - Looks up user WHERE email = input AND role = 'admin' AND is_active = true
   - If no user: return 401 "Invalid credentials"
   - Compare password with bcrypt against user.password_hash
   - If mismatch: return 401 "Invalid credentials"
   - If match: generate JWT using existing generateToken(user.id, user.role)
   - Return: { success: true, data: { token, user: { id, name, email, role } } }

5. Add route in backend/src/routes/auth.routes.js:
   - router.post('/admin-login', adminLogin)
   - This route must NOT have authMiddleware

=== PART B: Missing Admin Endpoints ===

6. Add to backend/src/controllers/admin.controller.js:

   a) updateOrderStatus:
      - PATCH /api/admin/orders/:id/status
      - Body: { status } — validates status is one of: placed, agent_assigned, picked_up, at_partner, processing, out_for_delivery, delivered, cancelled
      - Updates orders.status and orders.updated_at
      - Returns the updated order

   b) getAllServicesAdmin:
      - GET /api/admin/services
      - Returns ALL service_items joined with their parent services table
      - Include: si.id, si.name, si.price, si.unit, si.is_active, si.service_id, s.name as service_name
      - Order by s.display_order, si.display_order

   c) updateCoupon:
      - PATCH /api/admin/coupons/:id
      - Body can include: code, discount_type, discount_value, min_order, max_discount, expires_at, usage_limit, is_active
      - Only updates fields that are provided (not undefined)
      - Returns updated coupon

   d) deleteCoupon:
      - DELETE /api/admin/coupons/:id
      - Hard delete from coupons table
      - Returns { success: true, message: 'Coupon deleted' }

7. Register routes in backend/src/routes/admin.routes.js:
   router.patch('/orders/:id/status', updateOrderStatus);
   router.get('/services', getAllServicesAdmin);
   router.patch('/coupons/:id', updateCoupon);
   router.delete('/coupons/:id', deleteCoupon);

8. Run migration: cd /Volumes/Crucial/LaundryApp-Project/backend && npx knex migrate:latest
9. Run seed: cd /Volumes/Crucial/LaundryApp-Project/backend && npx knex seed:run --specific=004_admin_user.js

VERIFY:
- Start server: npm start
- Test login: curl -X POST http://localhost:3000/api/auth/admin-login -H "Content-Type: application/json" -d '{"email":"admin@rapidry.in","password":"Rapidry@2026"}'
- Should return a JWT token
- Test with token: curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/dashboard
```

---

## PROMPT 2 — Frontend Foundation: Theme + API + Auth + Layout + Routing

```
I'm building the Rapidry admin dashboard frontend.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

CURRENT STATE:
- Vite 8 + React 19 + TypeScript scaffold (default starter)
- Dependencies already installed: zustand, axios, react-router-dom, recharts, @tanstack/react-table, lucide-react, date-fns
- src/pages/, src/services/, src/store/ are EMPTY
- App.tsx is the default Vite counter demo
- Backend runs at http://localhost:3000 (dev) with JWT auth
- Admin login: POST /api/auth/admin-login with { email, password } returns { token, user }
- All admin APIs: GET/POST/PATCH/DELETE /api/admin/* with Bearer token

DESIGN SYSTEM (from Figma reference — match EXACTLY):
- Fonts: Playfair Display (headings: 600, 700) + DM Sans (body/UI: 400, 500, 600, 700)
- Colors:
  --color-forest-dark: #0F2E2A (sidebar bg, dark elements)
  --color-cream: #F3EFE6 (content bg alternatives, pills)
  --color-cream-bg: #F7F5F0 (main page background)
  --color-gold: #D6B97B (primary CTA, accents, active states)
  --color-white: #FFFFFF (cards, topbar)
  --color-border: #EAE4D8 (borders, dividers)
  --color-muted: #9CAB9A (muted text, inactive icons)
  --color-body: #4A5568 (secondary body text)
  --color-dark: #0F2E2A (primary text)
  --color-success: #15803D, --color-success-bg: #F0FDF4, --color-success-border: #86EFAC
  --color-error: #991B1B, --color-error-bg: #FEF2F2, --color-error-border: #FCA5A5
  --color-info: #1D4ED8, --color-info-bg: #EFF6FF, --color-info-border: #93C5FD
  --color-warning: #92400E, --color-warning-bg: #FEF3C7, --color-warning-border: #FCD34D
  --color-purple: #6B21A8, --color-purple-bg: #F3E8FF, --color-purple-border: #C084FC
- Sidebar: 240px fixed width
- Border radius: cards 16px, inputs 10px, buttons 10px, pills 999px
- Shadows: cards 0px 2px 8px rgba(0,0,0,0.04)

BUILD THE FOLLOWING FILES:

=== 1. src/styles/theme.css ===
- @import Google Fonts (Playfair Display 600,700 + DM Sans 400,500,600,700)
- :root with ALL CSS custom properties listed above
- body: font-family DM Sans, bg var(--color-cream-bg), color var(--color-dark), margin 0
- *, *::before, *::after: box-sizing border-box
- Utility classes: .font-display (Playfair Display), .font-body (DM Sans)

=== 2. src/services/api.ts ===
- Create axios instance with baseURL from import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
- Request interceptor: read token from localStorage('rapidry_admin_token'), attach as Bearer header
- Response interceptor: on 401 → clear token from localStorage, redirect to /login
- Export adminApi object with ALL these methods (each returns the .data from response):
  login(email, password) → POST /auth/admin-login
  getDashboardStats() → GET /admin/dashboard
  getAnalytics() → GET /admin/analytics
  getOrders(params?: { status?, search?, date_from?, date_to?, page?, limit? }) → GET /admin/orders
  getOrderDetail(id) → GET /admin/orders/:id
  assignAgent(orderId, agentId) → PATCH /admin/orders/:id/assign
  updateOrderStatus(id, status) → PATCH /admin/orders/:id/status
  getAgents() → GET /admin/agents
  createAgent(data: { name, phone, email?, zone? }) → POST /admin/agents
  suspendAgent(id) → PATCH /admin/agents/:id/suspend
  getCustomers(params?: { search?, page?, limit? }) → GET /admin/customers
  getPartners() → GET /admin/partners
  getCoupons() → GET /admin/coupons
  createCoupon(data) → POST /admin/coupons
  updateCoupon(id, data) → PATCH /admin/coupons/:id
  deleteCoupon(id) → DELETE /admin/coupons/:id
  getServices() → GET /admin/services
  updateServicePricing(id, price) → PUT /admin/services/:id

=== 3. src/store/authStore.ts ===
- Zustand store with:
  token: string | null (init from localStorage)
  user: { id: string, name: string, email: string, role: string } | null
  isAuthenticated: boolean (derived from !!token)
  login: async (email, password) => calls adminApi.login, stores token in localStorage + state, stores user
  logout: () => clears localStorage + state, navigates to /login

=== 4. src/pages/LoginPage.tsx ===
Full-screen login page:
- Background: #0F2E2A full viewport
- Centered card: white bg, max-width 420px, border-radius 20px, padding 40px, shadow 0px 24px 64px rgba(15,46,42,0.20)
- Logo area: "RAPIDRY" text in gold (#D6B97B), Playfair Display 28px 700, mb 4px
- Subtitle: "Admin Portal" — DM Sans 14px 400, #9CAB9A, mb 32px
- Email input: full width, height 48px, border 1.5px solid #EAE4D8, border-radius 10px, padding 14px 16px, DM Sans 14px, placeholder "Email address"
- Password input: same styling, type password, placeholder "Password", mb 24px
- Login button: full width, height 48px, bg #D6B97B, color #0F2E2A, DM Sans 15px 600, border-radius 999px (pill), border none, cursor pointer, hover opacity 0.9
- Error state: red text below inputs (DM Sans 13px, #991B1B)
- Loading state: button shows "Signing in..." and is disabled
- On success: redirect to / (dashboard)
- If already authenticated: redirect to / immediately

=== 5. src/components/layout/Sidebar.tsx ===
Fixed left sidebar, width 240px, bg #0F2E2A, full viewport height, flex column.

Brand (padding 24px):
- "RAPIDRY" text in gold, Playfair Display 20px 700, OR logo image, mb 4px
- "Admin Portal" — DM Sans 11px 400, #9CAB9A

Nav (flex-1, overflow-y auto):
Three sections: MAIN, MANAGE, SYSTEM
Section labels: DM Sans 10px 500, #9CAB9A, uppercase, letter-spacing 1px, padding 24px 20px 8px

MAIN: Dashboard, Orders, Agents, Partners
MANAGE: Customers, Analytics, Coupons
SYSTEM: Settings

Each nav item (use NavLink from react-router-dom):
- Full width, flex row, gap 12px, padding 10px 16px, margin 2px 8px, border-radius 10px
- Use lucide-react icons (LayoutDashboard, ClipboardList, Users, Building2, User, BarChart3, Tag, Settings)
- ACTIVE: bg rgba(214,185,123,0.12), text weight 600 opacity 1, icon color #D6B97B, gold left bar (3px wide, absolute left-0, rounded-r-full, bg #D6B97B)
- INACTIVE: bg transparent, text weight 400 opacity 0.7, icon color #9CAB9A, hover bg rgba(243,239,230,0.06)
- Text: DM Sans 14px, color #F3EFE6

User section (bottom, border-top rgba(243,239,230,0.10), padding 20px 16px):
- Row: 32px gold circle avatar (initials from user.name, DM Sans 13px 600, #0F2E2A) + name column + logout icon (LogOut from lucide)
- Name: DM Sans 13px 600, #F3EFE6, truncate
- Role: "Super Admin" — DM Sans 11px 400, #9CAB9A
- Get user from authStore. On logout click → authStore.logout()

=== 6. src/components/layout/Topbar.tsx ===
Props: title: string, subtitle: string

Height 64px, bg white, border-bottom 1px solid #EAE4D8, padding 0 32px, flex row justify-between align-center.

LEFT:
- Title: Playfair Display 22px 600, #0F2E2A, mb 2px
- Subtitle: DM Sans 13px 400, #9CAB9A

RIGHT (flex row, gap 16px, align-center):
- Notification bell (Bell from lucide, 20px, #0F2E2A) with red badge (absolute -top-1 -right-1, bg #991B1B, white text 9px 700, padding 2px 5px, pill shape) showing count "3"
- Avatar: 36px gold circle, initials from authStore user, DM Sans 14px 600, #0F2E2A

=== 7. src/components/layout/AdminLayout.tsx ===
- Check authStore.isAuthenticated — if false, Navigate to /login
- Render: flex row, Sidebar on left, main content on right (flex-1, flex column, overflow hidden)
- Main: Topbar at top + <Outlet /> below (flex-1, overflow-y auto)
- Pass title/subtitle to Topbar based on current route (useLocation)
- Title mapping: / → "Dashboard" + formatted current date, /orders → "Orders" + "Manage all customer orders", /management → "Management" + "Manage agents, coupons, and services"

=== 8. src/App.tsx ===
Replace entire file with React Router setup:
- Import theme.css
- BrowserRouter wrapping Routes:
  /login → LoginPage
  / → AdminLayout wrapper with nested routes:
    index → DashboardPage (create empty placeholder for now: export default function DashboardPage() { return <div>Dashboard</div> })
    orders → OrdersPage (placeholder)
    management → ManagementPage (placeholder)
    * → Navigate to /

=== 9. src/main.tsx ===
- Import './styles/theme.css' instead of './index.css'

=== 10. Create .env file at admin-dashboard/.env ===
VITE_API_URL=http://localhost:3000/api

=== 11. Update vite.config.ts ===
- Add server.port: 5174 (so it doesn't conflict with the marketing website on 5173)

VERIFY after building:
- Run: cd /Volumes/Crucial/LaundryApp-Project/admin-dashboard && npm run dev
- Open http://localhost:5174/login — should see dark green login page
- Enter admin@rapidry.in / Rapidry@2026 — should redirect to dashboard
- Sidebar should show with correct nav sections (MAIN/MANAGE/SYSTEM)
- Active nav item should have gold left bar
- Topbar should show page title + notification bell + avatar
- Clicking logout should return to login page
- Refreshing page should maintain login (token in localStorage)
```

---

## PROMPT 3 — Dashboard Page (KPI Cards + Orders Table + Right Cards)

```
Continuing the Rapidry admin dashboard.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

The foundation is built (theme, API, auth, layout, routing). Now build the dashboard page.

REFERENCE: /Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AdminDashboard.tsx

Create src/pages/DashboardPage.tsx with the following EXACT layout:

=== DATA FETCHING ===
On mount, fetch in parallel:
- adminApi.getDashboardStats() → { orders_today, revenue_today, active_agents, pending_pickups }
- adminApi.getAnalytics() → { labels[], revenue[], orders[] }
- adminApi.getOrders({ limit: 7 }) → { orders[] }

Use useState for: stats, analytics, recentOrders, loading, activeFilter ('all'|'placed'|'processing'|'delivered')

=== KPI CARDS ROW (padding 32px, flex row, gap 20px) ===
4 equal-width cards. Each:
- White bg, border-radius 16px, padding 20px 24px
- Shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)

Card inner layout:
1. Top row (flex justify-between, mb 12px):
   - LEFT: 40px circle, bg #F3EFE6, centered lucide icon (20px, stroke #0F2E2A, strokeWidth 2)
     Card 1: ClipboardList, Card 2: Users, Card 3: IndianRupee, Card 4: Clock
   - RIGHT: Trend badge — pill (border-radius 999px), padding 4px 10px, DM Sans 11px 600
     Card 1: bg #F0FDF4, text #15803D, "↑ +12%"
     Card 2: bg #EFF6FF, text #1D4ED8, "8/12"
     Card 3: bg #F0FDF4, text #15803D, "↑ +8%"
     Card 4: bg #FEF2F2, text #991B1B, "URGENT"

2. Value: Playfair Display 32px 700, color #0F2E2A, line-height 1, mb 4px
   - Card 3: prefix "₹" + format number with commas
   - Card 4: value color #991B1B (red)

3. Label: DM Sans 13px 400, #4A5568, mb 12px
   Card 1: "Today's Orders", Card 2: "Active Agents Online", Card 3: "Today's Revenue", Card 4: "Pending Assignment"

4. Progress bar: 3px height, bg #F3EFE6, border-radius 999px, overflow hidden
   - Inner fill: border-radius 999px
   - Cards 1-3: fill bg #D6B97B, widths 78%, 67%, 85%
   - Card 4: fill bg #991B1B, width 100%

=== CONTENT GRID (padding 0 32px 32px, flex row, gap 20px) ===

LEFT (flex: 1, min-width 0):
White card, border-radius 16px, padding 24px, same shadow.

A) Header (flex justify-between, align-center, mb 16px):
   - "Recent Orders" — Playfair Display 16px 600, #0F2E2A
   - "View all →" — DM Sans 13px 600, #D6B97B, cursor pointer, hover opacity 0.7. onClick → navigate('/orders')

B) Filter pills (flex row, gap 8px, mb 16px):
   Buttons: "All", "Placed", "Processing", "Delivered"
   - Active: bg #D6B97B, color #0F2E2A
   - Inactive: bg #F3EFE6, color #4A5568
   - All: border none, pill shape 999px, padding 6px 14px, DM Sans 12px 500, cursor pointer
   - onClick: set activeFilter, filter recentOrders client-side

C) Orders table:
   Header row: DM Sans 11px 600, #9CAB9A, uppercase, letter-spacing 0.5px, padding 12px 8px, border-bottom 1px solid #F3EFE6
   Columns: "Order ID", "Customer", "Service", "Agent", "Status", "Amount"

   Body rows:
   - Padding 16px 8px, border-bottom 1px solid #F3EFE6
   - Order ID: DM Sans 13px 500 #0F2E2A, prefix "#" + order_number
   - Customer: DM Sans 13px 400 #0F2E2A, from customer_name
   - Service: DM Sans 13px 400 #4A5568 (use first service if available, or "—")
   - Agent: DM Sans 13px 400 #4A5568. If null → "—"
   - Status: pill badge (999px, 4px 10px, DM Sans 11px 500) with colors:
     placed: bg rgba(214,185,123,0.12), text #D6B97B, border 1px solid #D6B97B
     agent_assigned/processing: bg #EFF6FF, text #1D4ED8, border 1px solid #93C5FD
     delivered: bg #F0FDF4, text #15803D, border 1px solid #86EFAC
     cancelled: bg #FEF2F2, text #991B1B, border 1px solid #FCA5A5
   - Amount: DM Sans 14px 600 #0F2E2A, "₹" + total
   - Row hover: background #FAFAF8

RIGHT (width 340px, flex-shrink 0, flex column, gap 20px):

D) Online Agents card:
   White bg, 16px radius, padding 20px, same shadow
   - "X agents online" — Playfair Display 16px 600, #0F2E2A, mb 12px (X = active_agents from stats)
   - Avatar stack: 5 gold circles (32px, DM Sans 10px 600 #0F2E2A), white border 2px, margin-left -8px on items after first. Just show "RK", "AS", "SD", "VP", "RM" as placeholder initials
   - "5 on pickup · 3 idle" — DM Sans 13px 400, #4A5568, mt 12px

E) Revenue card:
   White bg, 16px radius, padding 20px, same shadow
   - Value: "₹" + sum of analytics.revenue array formatted with commas — Playfair Display 24px 700, #0F2E2A, mb 4px
   - "This week's revenue" — DM Sans 13px 400, #4A5568, mb 16px
   - Sparkline: Use Recharts AreaChart (width 100%, height 60px):
     - Area fill: #F5EDDA at 50% opacity
     - Line stroke: #D6B97B, strokeWidth 2
     - No axes, no grid, no tooltips — pure sparkline
     - Data from analytics.revenue array

F) Urgent CTA card:
   bg #0F2E2A, 16px radius, padding 20px
   - Title: "X orders pending agent" — Playfair Display 15px 600, #F3EFE6, mb 12px (X = pending_pickups)
   - Button: full width, bg #D6B97B, color #0F2E2A, pill (999px), padding 10px 16px, DM Sans 13px 600
   - Text: "Assign now →"
   - onClick → navigate('/orders?status=placed')

=== LOADING STATE ===
While data is loading, show skeleton cards (bg #F3EFE6, animate pulse, same dimensions as real cards)

VERIFY:
- 4 KPI cards render with correct icons, values, progress bars
- Card 4 has red value + red progress bar + "URGENT" badge
- Recent orders table shows data from API
- Filter pills filter the table
- Right side has 3 stacked cards
- Sparkline renders in the revenue card
- "View all →" navigates to /orders
- "Assign now →" navigates to /orders?status=placed
```

---

## PROMPT 4 — Orders Page (Filter Bar + Table + Assignment Dropdown + Side Panel)

```
Continuing the Rapidry admin dashboard.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

REFERENCE: /Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AdminOrdersPage.tsx
REFERENCE: /Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentAssignmentDropdown.tsx

Build 3 files:

=== FILE 1: src/pages/OrdersPage.tsx ===

STATE:
- orders: Order[], loading, searchTerm, statusFilter ('all'|statuses), dateFilter, zoneFilter
- selectedOrder: Order | null (for side panel)
- assignDropdown: { orderId: string, anchorEl: HTMLElement } | null
- Read URL search params on mount — if ?status=placed, set statusFilter

DATA FETCHING:
- On mount + on filter change: adminApi.getOrders({ status: statusFilter !== 'all' ? statusFilter : undefined, search: searchTerm, page, limit: 20 })
- Debounce searchTerm by 300ms before fetching
- On "View" click: adminApi.getOrderDetail(id) → set selectedOrder → open side panel

FILTER BAR (padding 24px 32px 0):
White card: bg white, border-radius 16px, padding 16px 20px, shadow 0px 2px 8px rgba(0,0,0,0.04)
Single flex row, gap 12px, align-center:

1. Search input (width 280px, height 40px): lucide Search icon (16px, #9CAB9A) absolute left-12px center. Padding-left 38px, border 1.5px solid #EAE4D8, border-radius 10px, DM Sans 14px. Placeholder "Search by order ID, customer...". Focus: border #D6B97B, box-shadow 0 0 0 3px rgba(214,185,123,0.1)

2. Status <select> (width 140px, height 40px): border 1.5px solid #EAE4D8, radius 10px, DM Sans 14px #0F2E2A. Options: All Status, Placed, Processing, Out for Pickup, At Partner, Delivered, Cancelled

3. Date range button (width 140px, height 40px): same border, flex row gap 8px. Calendar icon (lucide Calendar, 14px #9CAB9A) + "Last 7 days"

4. Zone <select> (width 140px, height 40px): Options: All Zones, Sector 1-15, Sector 34-48, DLF Phase 1-5

5. flex-1 spacer

6. Export CSV button (height 40px, padding 0 16px): border 1.5px solid #D6B97B, radius 10px, bg transparent, color #D6B97B, DM Sans 14px 600. lucide Download icon 16px. Hover bg rgba(214,185,123,0.08)

7. "+ New Order" button (height 40px, padding 0 20px): bg #0F2E2A, color #F3EFE6, radius 10px, DM Sans 14px 600

ACTIVE FILTERS STRIP (show when filters applied, padding 8px 0 inside the 32px margins):
- Gold pill badges: bg #D6B97B, color #0F2E2A, pill, padding 6px 12px, DM Sans 13px 500. Text: "Status: Placed" + × button to clear
- "Clear all" outline btn: border 1.5px solid #D6B97B, color #D6B97B, pill, DM Sans 13px 600

ORDERS TABLE (white card, radius 16px, margin 16px 32px, shadow, overflow hidden):
Full width table, border-collapse collapse.

Header: bg #F7F5F0, border-bottom 1px solid #EAE4D8. Each th: padding 0 12px (first: 0 20px), height 44px, DM Sans 11px 600, #9CAB9A, uppercase, letter-spacing 0.5px, text-left

Columns (10):
1. "#" (40px) — row index, DM Sans 13px 400 #9CAB9A
2. "Order ID" (100px) — font-family 'Courier New', monospace, 13px 600, #0F2E2A (e.g. "RD-2847")
3. "Customer" (160px) — 24px gold avatar circle (initials, 10px 600 #0F2E2A) + name (14px 400 #0F2E2A)
4. "Service" (120px) — cream pill: bg #F3EFE6, #0F2E2A, pill, 4px 10px, 12px 500
5. "Pickup Slot" (140px) — 13px 400 #0F2E2A
6. "Agent" (140px) — if assigned: 24px dark avatar (#0F2E2A, initials #F3EFE6, 11px 600) + name (13px 400). If null: "Assign" gold text button (12px 600 #D6B97B) → opens AgentAssignmentDropdown
7. "Partner" (120px) — 13px 400 #4A5568
8. "Status" (120px) — pill badge, 11px 500:
   placed: bg rgba(214,185,123,0.12), #D6B97B, border 1px solid #D6B97B
   agent_assigned: bg #EFF6FF, #1D4ED8, border 1px solid #93C5FD
   picked_up/out_for_delivery: bg #FEF3C7, #92400E, border 1px solid #FCD34D
   at_partner/processing: bg #F3E8FF, #6B21A8, border 1px solid #C084FC
   delivered: bg #F0FDF4, #15803D, border 1px solid #86EFAC
   cancelled: bg #FEF2F2, #991B1B, border 1px solid #FCA5A5
9. "Amount" (80px) — 14px 600 #0F2E2A, "₹640"
10. "Action" (100px) — "View" button (bg none, border 1px solid #EAE4D8, radius 6px, 4px 10px, 12px 600 #0F2E2A, hover bg #F3EFE6) + ⋮ dots button (lucide MoreVertical, 16px #9CAB9A)

Body rows: height 60px, border-bottom 0.5px solid #F3EFE6
- Unassigned: border-left 3px solid #D6B97B, hover bg #FFFBF0
- Assigned: border-left 3px solid transparent, hover bg #FAFAF8, hover border-left-color #D6B97B

PAGINATION (below table, padding 16px 20px, flex justify-between):
- "Showing 1-20 of 45 orders" — DM Sans 13px 400 #9CAB9A
- Prev/Next buttons with lucide ChevronLeft/ChevronRight

=== FILE 2: src/components/orders/AgentAssignmentDropdown.tsx ===

This is a DROPDOWN (NOT a modal) — fixed position, anchored below the "Assign" button.

Props: anchorEl: HTMLElement, orderId: string, onAssign: (orderId, agentId) => void, onClose: () => void

On mount: fetch adminApi.getAgents()

Container: fixed z-50, width 280px, max-height 240px, bg white, border 1px solid #EAE4D8, radius 12px, shadow 0px 12px 32px rgba(0,0,0,0.12) + 0px 4px 12px rgba(0,0,0,0.08). Position: use anchorEl.getBoundingClientRect() to place below anchor (top = rect.bottom + 4, left = rect.left). Adjust if off-screen.

Header (padding 12px 14px, border-bottom 1px solid #EAE4D8):
- "Select Agent" — DM Sans 13px 600, #0F2E2A
- "X online now" — DM Sans 12px 400, #9CAB9A

Agent list (scrollable, padding 4px):
Each row: button, height 56px, padding 10px 14px, flex row gap 10px, radius 8px, mb 2px
- 28px gold avatar with initials (DM Sans 11px 600 #0F2E2A)
- Name (14px 600) + meta: 13px 400 #9CAB9A showing today_delivery_count + " tasks today"
- Rating (12px 600 #D6B97B)
- SELECTED: bg #0F2E2A, name #FFFFFF, meta #F3EFE6, rating → gold checkmark (lucide Check)
- UNSELECTED hover: bg #F0FDFA
- Offline agents: opacity 0.5, cursor not-allowed, disabled

Bottom (padding 10px 14px, border-top 1px solid #EAE4D8):
- "Assign to selected agent" — full width, height 44px, bg #D6B97B (or 40% opacity if none selected), #0F2E2A, pill 999px, 14px 600. Disabled if no selection.
- onClick: call onAssign(orderId, selectedAgentId)

Close on click outside (useEffect with mousedown listener).

=== FILE 3: src/components/orders/OrderDetailPanel.tsx ===

Props: order: OrderDetail (from getOrderDetail), onClose: () => void, onAssignAgent: (orderId) => void

BACKDROP: fixed inset-0, bg rgba(0,0,0,0.3), z-40, left offset 240px (sidebar). Click → onClose.

PANEL: fixed top-0 right-0 bottom-0, width 400px, bg white, border-left 1px solid #EAE4D8, z-50, overflow-y auto, transition transform.

1. Sticky header (bg white, border-bottom #EAE4D8, padding 20px 24px, flex justify-between):
   - "Order Details" — Playfair Display 18px 600, #0F2E2A, mb 2px
   - Order number (Courier New 13px 600, #9CAB9A)
   - Close X button (lucide X, 20px, hover opacity 0.7)

2. Status badge (padding 24px 24px 0, mb 24px):
   Same status pill styling but larger: padding 6px 14px, DM Sans 13px 600

3. Customer (mb 24px, padding 0 24px):
   - Section label: "CUSTOMER" — DM Sans 11px 600, #9CAB9A, uppercase, letter-spacing 0.5px, mb 12px
   - 40px gold avatar + Name (15px 600 #0F2E2A) + Phone (13px 400 #9CAB9A)
   - Address: 14px 400 #4A5568, line-height 1.5

4. Service & Pickup card (bg #F7F5F0, radius 12px, padding 16px, margin 0 24px, mb 24px):
   - 2-col: Service name left, Pickup Slot right
   - Labels: 11px 600 #9CAB9A uppercase. Values: 14px 600 #0F2E2A
   - Divider + Partner below

5. Items (mb 24px, padding 0 24px):
   - "ITEMS (X)" section label
   - Each item: bg #FAFAF8, radius 8px, padding 10px 12px. Name (14px 500) + "× qty" (13px 400 #9CAB9A) | Price (14px 600 #0F2E2A)
   - Total row: border-top #EAE4D8. "Total Amount" (15px 600) | "₹X" (Playfair 20px 700 #0F2E2A)

6. Assigned Agent (mb 24px, padding 0 24px):
   - If assigned: 36px dark avatar + name (14px 600) + "Pickup Agent" (12px 400 #9CAB9A)
   - If unassigned: "Assign Agent" button (border 1.5px solid #D6B97B, bg rgba(214,185,123,0.12), color #D6B97B, radius 10px, 14px 600, full width)

7. Timeline (mb 24px, padding 0 24px):
   - "ORDER TIMELINE" section label
   - From order.deliveries data, build timeline events
   - Vertical dots (24px circles) + connecting lines (2px × 16px):
     completed: bg #15803D, border #86EFAC, white check icon
     current: bg #D6B97B, border #D6B97B, 8px dark dot
     pending: bg #F3EFE6, border #EAE4D8
   - Lines: after completed = #86EFAC, else #EAE4D8

8. Action buttons (padding 0 24px 24px, flex row gap 12px):
   - "Update Status": flex-1, padding 12px, bg #0F2E2A, color #F3EFE6, radius 10px, 14px 600
   - "Print": same padding, border 1.5px solid #EAE4D8, bg transparent, #0F2E2A, radius 10px, 14px 600

VERIFY:
- Filter bar has all 7 elements
- Active filter pills appear when filters applied
- Table has 10 columns, unassigned rows have gold left border
- "Assign" opens dropdown (NOT modal) below the button
- Agent dropdown shows online/offline agents, selected state is dark bg
- Assigning closes dropdown and updates row inline
- "View" opens 400px side panel with all 8 sections
- Panel closes on backdrop click or X
```

---

## PROMPT 5 — Management Page (Tabs + Agents + Coupons + Service Catalog)

```
Continuing the Rapidry admin dashboard.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

REFERENCE: /Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AdminManagementPage.tsx

Build 4 files:

=== FILE 1: src/pages/ManagementPage.tsx ===

State: activeTab ('agents'|'partners'|'customers'|'coupons'|'services')

TAB BAR (margin 24px 32px 0):
Container: display inline-flex, bg #F3EFE6, border-radius 16px, padding 4px, gap 4px
Tabs: "Agents", "Partners", "Customers", "Coupons", "Service Catalog"
Each: padding 8px 20px, radius 12px, border none, white-space nowrap, cursor pointer, DM Sans 14px
- Active: bg #0F2E2A, color white, weight 600
- Inactive: bg transparent, color #4A5568, weight 400

Content area below tabs: renders AgentsTab / CouponsTab / ServiceCatalogTab component based on activeTab.
Partners + Customers: show EmptyState placeholder (centered 80px muted icon + "Coming soon..." text)

=== FILE 2: src/components/management/AgentsTab.tsx ===

On mount: fetch adminApi.getAgents()

HEADER (margin 20px 32px, flex justify-between):
- "X Agents" — Playfair Display 20px 600, #0F2E2A
- "+ Add Agent" button: bg #D6B97B, #0F2E2A, 14px 600, padding 10px 20px, radius 10px
  - Opens a simple modal to create agent (name + phone + zone fields)

STATS STRIP (margin 0 32px 20px, flex row, gap 12px):
3 cards, flex-1:
- White bg, radius 12px, padding 16px, border 1.5px solid #EAE4D8
- Label: DM Sans 11px 600, #9CAB9A, uppercase, letter-spacing 0.5px, mb 6px
- Value: Playfair Display 28px 700

Card 1: "Online" → green value (#15803D), count agents where is_online=true
Card 2: "Offline" → gray value (#4A5568), count is_online=false
Card 3: "Pending Approval" → gold value (#D6B97B), border 1.5px solid #D6B97B (count where is_active=false or similar)

AGENTS TABLE (white card, 16px radius, margin 0 32px 32px, shadow, overflow hidden):
Header: bg #F7F5F0, border-bottom 1px solid #EAE4D8. Each th: padding 16px 20px, DM Sans 11px 600 #9CAB9A uppercase

Columns:
1. "Photo" — 36px gold avatar circle with initials (13px 600 #0F2E2A)
2. "Name" — 14px 600, #0F2E2A
3. "Phone" — 13px 400, #4A5568
4. "Status" — pill with 6px dot:
   Online: bg #F0FDF4, #15803D, border #86EFAC, green dot
   Offline: bg #F3F4F6, #6B7280, border #D1D5DB, gray dot
5. "Today's Tasks" — 14px 600, #0F2E2A (from today_delivery_count)
6. "Rating" — gold star icon (lucide Star, 16px, fill #D6B97B) + rating (13px 600 #0F2E2A)
7. "KYC Status" — pill badge:
   Verified (for is_active=true): bg #F0FDF4, #15803D, border #86EFAC, prefix "✓ "
   Pending: bg rgba(214,185,123,0.12), #D6B97B, border #D6B97B
   Rejected: bg #FEF2F2, #991B1B, border #FCA5A5
8. "Actions" — "View" btn (border #EAE4D8, 6px radius, 4px 10px, 12px 600 #0F2E2A, hover bg #F3EFE6) + "Suspend" btn (border #FCA5A5, #991B1B, hover bg #FEF2F2). Suspend calls adminApi.suspendAgent(id) then refetch.

Rows: border-bottom 0.5px solid #F3EFE6

=== FILE 3: src/components/management/CouponsTab.tsx ===

On mount: fetch adminApi.getCoupons()
State: showCreateModal boolean

HEADER (margin 20px 32px, flex justify-between):
- "Active Coupons: X" — Playfair Display 20px 600 (count where is_active=true)
- "+ Create Coupon": same gold button → sets showCreateModal=true

COUPONS TABLE (same card styling):
Columns:
1. "Code" — font-family 'Courier New', monospace, 14px 700, #0F2E2A
2. "Type" — cream pill: bg #F3EFE6, #0F2E2A, 4px 10px, 12px 500 ("Percentage" or "Flat")
3. "Value" — 14px 600, color #D6B97B (GOLD text). Show "50%" or "₹200"
4. "Min Order" — 13px 400 #4A5568, "₹500"
5. "Uses" — 13px 400 #4A5568, "used_count / usage_limit"
6. "Expiry" — 13px 400 #4A5568, format date
7. "Status" — pill: Active=#F0FDF4/#15803D/#86EFAC, Expired=#FEF2F2/#991B1B/#FCA5A5, Disabled=#F3F4F6/#6B7280/#D1D5DB. Derive: if !is_active → 'Disabled', if expires_at < now → 'Expired', else 'Active'
8. "Actions" — "Edit" btn + ⋮ dots btn (lucide MoreVertical)

CREATE COUPON MODAL (showCreateModal):
Backdrop: bg black/40%, flex center. Click backdrop → close.
Modal: width 480px, bg white, radius 20px, shadow 0px 24px 64px rgba(15,46,42,0.20), padding 32px

Header (flex justify-between, mb 24px):
- "Create Coupon Code" — Playfair Display 20px 600 #0F2E2A
- Close X button

Form (flex column, gap 20px):
1. Coupon Code: label row ("Coupon Code" + "Generate random" gold link that creates random 8-char code). Input: Courier New 14px 700, uppercase, border 1.5px solid #EAE4D8, radius 10px, padding 12px 16px

2. Discount Type — TWO PILL TOGGLE BUTTONS (not a select!):
   flex row, gap 12px, each flex-1
   Selected: bg #D6B97B, border 1.5px solid #D6B97B, #0F2E2A, 14px 600
   Unselected: bg transparent, border 1.5px solid #EAE4D8, #4A5568, 14px 600, hover bg rgba(214,185,123,0.08)
   Options: "Percentage %" and "Flat Amount ₹"

3. Two-column (flex gap 12px): "Discount Value" + "Min Order (₹)" — number inputs

4. Two-column: "Usage Limit" + "Expiry Date" (type date)

5. "Create Coupon" button: full width, bg #D6B97B, #0F2E2A, 15px 600, radius 12px, padding 14px, mt 8px

6. "Cancel" button: full width, border 1.5px solid #EAE4D8, #4A5568, 14px 600, radius 12px, padding 12px

All inputs: padding 12px 16px, border 1.5px solid #EAE4D8, radius 10px, DM Sans 14px

On submit: call adminApi.createCoupon(data), close modal, refetch coupons list.

=== FILE 4: src/components/management/ServiceCatalogTab.tsx ===

On mount: fetch adminApi.getServices()
State: editingServiceId: string|null, editPrice: string

HEADER (margin 20px 32px):
- "Service Catalog" — Playfair Display 20px 600, #0F2E2A
- "Manage pricing and availability" — DM Sans 13px 400, #9CAB9A, mt 4px

3-COLUMN CARD GRID (display grid, grid-template-columns repeat(3, 1fr), gap 20px, margin 0 32px 32px):

Each service card:
- White bg, radius 16px, padding 24px, shadow, border 1.5px solid #EAE4D8
- Hover: border-color #D6B97B (transition 0.2s). Use CSS group/hover pattern.

Card layout:
1. Top row (flex justify-between, mb 16px):
   - LEFT: Service icon (use lucide icons: Shirt for wash, Sparkles for dry clean, Crown for premium, Zap for express, Package for fold, Flame for iron), 40px, stroke #0F2E2A. Below: name (Playfair 16px 600 #0F2E2A, mb 4px)
   - RIGHT: Toggle switch (44px × 24px, pill):
     Active: bg #15803D, knob at right. Inactive: bg #D1D5DB, knob at left.
     Knob: 18px white circle, absolute top 3px. Animate with transition.

2. DEFAULT state:
   - Price: "₹80" — Playfair Display 28px 700, #D6B97B
   - Unit: "per piece" or "per kg" — DM Sans 12px 400, #9CAB9A, mb 12px
   - "Edit Pricing" button: HIDDEN by default, shows on card hover (opacity 0→1 transition)
     bg transparent, border 1px solid #D6B97B, color #D6B97B, radius 8px, padding 6px 12px, DM Sans 13px 600
     Includes lucide Pencil icon 14px. onClick → setEditingServiceId, setEditPrice

3. EDIT state (editingServiceId === service.id):
   - "₹" prefix (Playfair 24px 700 #D6B97B) + number input (same font, border 2px solid #D6B97B, radius 8px, padding 4px 8px, width 100px, bg #FFFBF5)
   - Unit text below
   - Button row: "Save" (flex-1, bg #D6B97B, #0F2E2A, 13px 600, 8px 12px, radius 8px, lucide Check 14px) + "×" cancel (border 1px solid #FCA5A5, #991B1B, 13px 600, radius 8px)
   - On save: call adminApi.updateServicePricing(id, editPrice), refetch, clear editing state

VERIFY:
- Tab bar toggles 5 sections correctly
- Agents: stats strip + table with all 8 columns + View/Suspend buttons
- Coupons: table with Courier New codes + gold value text + create modal with pill toggles
- Service Catalog: 3-col card grid + toggle switches + hover edit button + inline edit mode
- Partners/Customers show "Coming soon..." placeholder
```

---

## PROMPT 6 — Deployment to Vercel + GoDaddy DNS + Backend CORS

```
I need to deploy the Rapidry admin dashboard to production.

PROJECT:
- Frontend: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/ (Vite + React SPA)
- Backend: Already deployed on Railway
- Domain: rapidry.in (owned on GoDaddy). Admin dashboard will live at admin.rapidry.in

=== STEP 1: PREPARE FRONTEND FOR PRODUCTION ===

1. Create admin-dashboard/vercel.json:
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

2. Verify vite.config.ts has proper build config:
- base: '/'
- build.outDir: 'dist'

3. Test production build locally:
cd /Volumes/Crucial/LaundryApp-Project/admin-dashboard
npm run build
npm run preview

=== STEP 2: DEPLOY TO VERCEL ===

Option A (CLI — quickest):
cd /Volumes/Crucial/LaundryApp-Project/admin-dashboard
npx vercel --prod

Option B (GitHub — recommended for CI/CD):
1. Push admin-dashboard code to GitHub
2. vercel.com → New Project → Import repo
3. Root directory: admin-dashboard/ (if monorepo)
4. Framework: Vite
5. Build command: npm run build
6. Output directory: dist

=== STEP 3: SET ENVIRONMENT VARIABLES ON VERCEL ===
In Vercel project settings → Environment Variables:
- VITE_API_URL = https://<your-railway-backend>.up.railway.app/api

IMPORTANT: Vite env vars are baked at build time. After adding/changing them, trigger a redeploy.

=== STEP 4: CUSTOM DOMAIN — admin.rapidry.in ===

A) In Vercel:
   1. Go to your project → Settings → Domains
   2. Add domain: admin.rapidry.in
   3. Vercel will show you the required DNS record (usually a CNAME)

B) In GoDaddy DNS Manager (dns.godaddy.com → rapidry.in):
   1. Click "Add Record"
   2. Type: CNAME
   3. Name: admin
   4. Value: cname.vercel-dns.com
   5. TTL: 600 (or default)
   6. Save

   Wait 5-10 minutes for DNS propagation. Vercel will auto-provision an SSL certificate.

   To verify DNS propagation, run: dig admin.rapidry.in CNAME
   Expected output should show: admin.rapidry.in → cname.vercel-dns.com

C) Back in Vercel:
   - The domain should turn green with "Valid Configuration"
   - SSL certificate is auto-provisioned (Let's Encrypt)
   - Your dashboard is now live at https://admin.rapidry.in

=== STEP 5: CONFIGURE BACKEND CORS ===
On Railway, set or update environment variable:
- ADMIN_URL = https://admin.rapidry.in

Then redeploy the backend on Railway so the CORS config picks up the new origin.

If your backend CORS setup reads from ADMIN_URL, the admin dashboard will now be able to make API calls. If CORS is still failing, check that the backend app.js includes ADMIN_URL in the allowed origins array.

=== STEP 6: SEED ADMIN USER ON PRODUCTION ===
Connect to your production PostgreSQL database and ensure the admin user exists:
- Run migration (if not already): npx knex migrate:latest (in production context)
- Seed admin user: INSERT the record with bcrypt-hashed password for admin@rapidry.in

=== STEP 7: VERIFY DEPLOYMENT ===
1. Open https://admin.rapidry.in
2. Login with admin@rapidry.in / Rapidry@2026
3. Dashboard should load with real production data
4. Test: create a coupon, view an order, assign an agent
5. Verify page refresh doesn't lose auth (JWT in localStorage)
6. Test from an incognito window to confirm SSL works

TROUBLESHOOTING:
- CORS error → Ensure Railway ADMIN_URL = https://admin.rapidry.in (exact match including https://)
- DNS not resolving → Wait 10-30 min, or try flushing local DNS: sudo dscacheutil -flushcache
- Vercel shows "Invalid Configuration" → Double-check CNAME record in GoDaddy (Name: admin, Value: cname.vercel-dns.com)
- 404 on page refresh → Ensure vercel.json has the SPA rewrite rule
```

---

## PROMPT 7 — Polish & Missing Features

```
Final polish for the Rapidry admin dashboard.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

Go through the existing code and add these finishing touches:

=== 1. LOADING STATES ===
Add skeleton loading for every page:
- Cards: bg #F3EFE6, animate-pulse, same dimensions
- Table: 5 skeleton rows with pulsing bars
- Use a reusable <Skeleton width height borderRadius /> component

=== 2. ERROR HANDLING ===
- Toast notification system for success/error messages
- Use a simple toast store (Zustand) with addToast(message, type) and auto-dismiss after 3 seconds
- Show toasts for: agent assigned, coupon created, price updated, login failed, API errors
- Toast positioning: fixed bottom-right, stack upward, gap 8px
- Toast styling: white bg, radius 12px, shadow, padding 12px 16px, DM Sans 13px
  - Success: left border 3px solid #15803D, lucide CheckCircle icon
  - Error: left border 3px solid #991B1B, lucide XCircle icon

=== 3. EMPTY STATES ===
When tables have no data:
- Centered in table area: muted icon (64px, #9CAB9A) + "No orders found" title (Playfair 18px 600 #0F2E2A) + "Try adjusting your filters" subtitle (DM Sans 14px 400 #9CAB9A)

=== 4. RESPONSIVE SIDEBAR ===
For screens < 1024px:
- Sidebar collapses to just icons (64px width)
- Hamburger menu button in topbar to toggle full sidebar
- Sidebar overlays content when expanded on small screens

=== 5. PAGE TITLE (document.title) ===
Set document.title on each page:
- Login: "Login — Rapidry Admin"
- Dashboard: "Dashboard — Rapidry Admin"
- Orders: "Orders — Rapidry Admin"
- Management: "Management — Rapidry Admin"

=== 6. KEYBOARD SHORTCUTS ===
- Escape: close any open modal/panel/dropdown
- Cmd+K or /: focus search input (on orders page)

VERIFY all these work:
- Loading skeletons visible on slow network
- Toast appears on successful agent assignment
- Empty state shows when filtering produces no results
- Sidebar collapses on narrow viewport
- Escape closes modals/panels
```
