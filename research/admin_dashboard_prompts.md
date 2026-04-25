# RapidDry Admin Dashboard — Phase-by-Phase Prompts

> Copy-paste each prompt into your AI coding assistant **one at a time**. Each is self-contained with full context. Complete one phase before moving to the next.

---

## PHASE 0 — Backend: Admin Login Endpoint

```
I'm building an admin dashboard for my laundry platform (Rapidry). The backend is at:
/Volumes/Crucial/LaundryApp-Project/backend/

CURRENT AUTH SYSTEM:
- File: backend/src/controllers/auth.controller.js — has verifyToken (Firebase phone OTP), getMe, updateProfile
- File: backend/src/routes/auth.routes.js — POST /auth/verify-token, GET /auth/me, PATCH /auth/me
- File: backend/src/middleware/auth.middleware.js — reads Bearer JWT from Authorization header, calls verifyToken(token), sets req.user = decoded
- File: backend/src/middleware/role.middleware.js — roleGuard(...allowedRoles) checks req.user.role
- File: backend/src/utils/jwt.js — generateToken(userId, role) creates JWT with { userId, role }, verifyToken(token) verifies it
- JWT_EXPIRES_IN defaults to 7d
- Users table has: id (UUID), firebase_uid, name, phone, email, role (customer/agent/admin/partner), avatar_url, is_active, created_at, updated_at

PROBLEM:
The admin dashboard needs email + password login. Current auth only supports Firebase Phone OTP which is for the mobile apps. I need a separate admin login endpoint.

WHAT TO BUILD:

1. Install bcryptjs in backend:
   npm install bcryptjs

2. Create new migration: backend/db/migrations/016_add_password_hash_to_users.js
   - Add column: password_hash TEXT nullable (only admin users will have this)

3. Create new seed: backend/db/seeds/004_admin_user.js
   - Create an admin user with:
     - firebase_uid: 'admin-dashboard-user'
     - name: 'Admin'
     - phone: '+910000000000'
     - email: 'admin@rapidry.in'
     - role: 'admin'
     - password_hash: bcrypt hash of 'Rapidry@2026' (10 salt rounds)
     - is_active: true

4. Add adminLogin function in backend/src/controllers/auth.controller.js:
   - Accepts POST body: { email, password }
   - Validates both fields are present
   - Looks up user WHERE email = input AND role = 'admin' AND is_active = true
   - If no user found: return 401 "Invalid credentials"
   - Compare password with bcrypt against user.password_hash
   - If mismatch: return 401 "Invalid credentials"
   - If match: generate JWT using existing generateToken(user.id, user.role)
   - Return: { success: true, data: { token, user } }
   - Export adminLogin from the module

5. Add route in backend/src/routes/auth.routes.js:
   - router.post('/admin-login', adminLogin)
   - This route should NOT have authMiddleware (it's the login endpoint)

6. Run the migration: cd backend && npx knex migrate:latest
7. Run the seed: cd backend && npx knex seed:run --specific=004_admin_user.js

VERIFY: Start server (npm run dev), then test:
curl -X POST http://localhost:3000/api/v1/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rapidry.in","password":"Rapidry@2026"}'

Should return { success: true, data: { token: "...", user: { role: "admin", ... } } }
```

---

## PHASE 1 — Foundation (Types, API Layer, Auth Store, Layout Shell)

```
I'm building the admin dashboard for Rapidry laundry platform.
Project location: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

CURRENT STATE:
- React 19 + TypeScript + Vite 8 (already initialized with npx create-vite)
- Dependencies already installed: react-router-dom, axios, recharts, @tanstack/react-table, zustand, lucide-react, date-fns
- src/constants/theme.ts already exists with these design tokens:
  COLORS: forestDark #0F2E2A, forestMid #183F3A, forestLight #1E4D47, gold #D6B97B, goldLight #E8D4A8, goldPale #F5EDDA, cream #F3EFE6, creamDark #EAE4D8, white #FFFFFF, textPrimary #0F2E2A, textSecondary #4A5568, textOnDark #F3EFE6, textGold #D6B97B, textMuted #9CAB9A, statusSuccess #15803D, statusWarning #D6B97B, statusError #991B1B, statusInfo #1E3A5F
  FONTS: display "'Playfair Display', serif", body "'DM Sans', sans-serif"
  SPACING: xs 4px, sm 8px, md 12px, base 16px, lg 20px, xl 24px, 2xl 32px, 3xl 40px, 4xl 48px, section 64px
  RADIUS: xs 4px, sm 8px, md 12px, lg 16px, xl 20px, 2xl 28px, pill 999px

BACKEND API INFO (already built, running at localhost:3000):
- Auth: POST /api/v1/auth/admin-login → body { email, password } → returns { success, data: { token, user } }
- Auth: GET /api/v1/auth/me → returns { success, data: user }
- All admin endpoints are prefixed /api/v1/admin/ and require Bearer JWT + role=admin
- API response format: always { success: boolean, data: T, message?: string }

DATABASE SCHEMA (for TypeScript types):
- users: id UUID, firebase_uid, name, phone, email, role (customer/agent/admin/partner), avatar_url, is_active, created_at, updated_at
- orders: id UUID, order_number (string unique), customer_id (FK users), address_id (FK addresses), status (placed/agent_assigned/picked_up/processing/ready/out_for_delivery/delivered/cancelled), total decimal, delivery_fee decimal, discount decimal, payment_status (pending/paid/failed/refunded), payment_method (upi/card/cod/wallet), pickup_date, pickup_slot, special_instructions, created_at, updated_at
- order_items: id UUID, order_id, service_item_id, quantity, unit_price, total_price
- addresses: id UUID, user_id, label, lat, lng, full_address, landmark, is_default
- agents: id UUID, user_id, is_online boolean, zone, rating decimal, total_deliveries int, current_lat, current_lng
- deliveries: id UUID, order_id, agent_id, type (pickup/drop), status, started_at, completed_at
- partners: id UUID, name, phone, email, zone, is_active, user_id, created_at
- coupons: id UUID, code, discount_type (flat/percent), discount_value decimal, min_order, max_discount, expires_at, usage_limit, used_count, is_active
- payments: id UUID, order_id, razorpay_order_id, razorpay_payment_id, amount, method, status
- notifications: id UUID, user_id, title, body, type, order_id, is_read, created_at
- services: id UUID, name, description, icon_url, is_active
- service_items: id UUID, service_id, name, price decimal, unit (per_item/per_kg)

NOW BUILD THE FOLLOWING (Phase 1 — Foundation):

1. UPDATE index.html:
   - Title: "RAPIDRY Admin"
   - Add Google Fonts preconnect and import for Playfair Display (400;600;700) and DM Sans (400;500;600;700)
   - Keep existing favicon

2. UPDATE vite.config.ts:
   - Add path alias: @ → ./src (using path.resolve)
   - Add server proxy: /api → http://localhost:3000

3. CREATE .env.development:
   VITE_API_URL=http://localhost:3000/api/v1

4. CREATE .env.production:
   VITE_API_URL=https://rapidry-backend-production.up.railway.app/api/v1

5. CREATE src/types/api.ts:
   - ApiResponse<T> = { success: boolean; data: T; message?: string }
   - PaginatedData<T> = { items: T[]; total: number; page: number; limit: number }

6. CREATE src/types/user.ts:
   - User interface matching users table columns
   - Customer = User & { order_count: number; total_spent: number }
   - Agent = { id, user_id, name, phone, email, is_active, is_online, zone, rating, total_deliveries, today_delivery_count }

7. CREATE src/types/order.ts:
   - OrderStatus union type (all 8 statuses)
   - PaymentStatus union type
   - Order (list view): id, order_number, status, total, payment_status, created_at, customer_name, customer_phone, item_count, agent_name
   - OrderItem: id, order_id, service_item_id, quantity, unit_price, total_price, service_name, service_current_price
   - Delivery: id, order_id, agent_id, type, status, started_at, completed_at, agent_name, agent_phone
   - OrderDetail: all Order fields + customer (User), address, items (OrderItem[]), payment, deliveries (Delivery[]), notifications

8. CREATE src/types/partner.ts:
   - Partner: id, name, phone, email, zone, is_active, user_id, user_name, user_phone, order_count, order_value_total

9. CREATE src/types/coupon.ts:
   - Coupon: id, code, discount_type, discount_value, min_order, max_discount, expires_at, usage_limit, used_count, is_active, usage_percent, created_at

10. CREATE src/types/service.ts:
    - Service: id, name, description, icon_url, is_active
    - ServiceItem: id, service_id, name, price, unit

11. CREATE src/services/api.ts:
    - Create axios instance with baseURL from import.meta.env.VITE_API_URL
    - Request interceptor: read token from localStorage key 'rapidry_admin_token', if exists add header Authorization: Bearer <token>
    - Response interceptor (success): return response.data.data (unwrap the envelope)
    - Response interceptor (error): if 401 → clear localStorage token → window.location.href = '/login'. Otherwise re-throw the error.
    - Export the instance

12. CREATE src/services/admin.api.ts:
    - Import the api instance
    - Export object adminApi with these functions:
      // Auth
      login: (email, password) => api.post('/auth/admin-login', { email, password }),
      getMe: () => api.get('/auth/me'),
      // Dashboard
      getDashboardStats: () => api.get('/admin/dashboard'),
      getAnalytics: () => api.get('/admin/analytics'),
      // Orders
      getOrders: (params: { status?, date_from?, date_to?, search?, page?, limit? }) => api.get('/admin/orders', { params }),
      getOrderDetail: (id: string) => api.get(`/admin/orders/${id}`),
      assignAgent: (orderId: string, agentId: string) => api.patch(`/admin/orders/${orderId}/assign`, { agent_id: agentId }),
      // Agents
      getAgents: () => api.get('/admin/agents'),
      createAgent: (data: { name, phone, email?, zone? }) => api.post('/admin/agents', data),
      suspendAgent: (id: string) => api.patch(`/admin/agents/${id}/suspend`),
      // Customers
      getCustomers: (params: { search?, page?, limit? }) => api.get('/admin/customers', { params }),
      // Partners
      getPartners: () => api.get('/admin/partners'),
      // Coupons
      getCoupons: () => api.get('/admin/coupons'),
      createCoupon: (data) => api.post('/admin/coupons', data),
      // Pricing
      updateServicePricing: (id: string, price: number) => api.put(`/admin/services/${id}`, { price }),
      getServices: () => api.get('/services'),
      getServiceItems: (serviceId: string) => api.get(`/services/${serviceId}/items`),

    IMPORTANT: Because the response interceptor already unwraps data, these functions return the inner data directly. Type them accordingly with generics.

13. CREATE src/store/authStore.ts (Zustand):
    - State: token (string|null), user (User|null), isLoading (boolean), isAuthenticated (boolean)
    - Actions:
      login(email, password): call adminApi.login → store token in localStorage 'rapidry_admin_token' → store user → set isAuthenticated
      logout(): clear localStorage token → reset state → redirect to /login
      checkAuth(): read token from localStorage → if exists call adminApi.getMe() → set user → if fails logout()
    - Initialize: on store creation, read token from localStorage

14. REWRITE src/index.css — Complete global styles:
    - CSS reset (box-sizing, margin, padding)
    - CSS variables from theme.ts tokens (all colors, fonts, spacing, radius)
    - --sidebar-width: 260px; --topbar-height: 64px;
    - body: font-family var(--font-body), background var(--color-cream), color var(--color-text-primary)
    - Scrollbar styling (thin, forest tinted)
    - Utility classes: .page-title (Playfair Display, 24px, forest dark), .page-header (flex between, align center, margin bottom 24px)

15. CREATE src/components/layout/Sidebar.tsx:
    - Fixed left sidebar, width var(--sidebar-width), height 100vh, background var(--color-forest-dark)
    - Top section: RapidDry logo text in gold + "Admin" subtitle in muted text
    - Navigation links using react-router-dom NavLink:
      Dashboard (LayoutDashboard icon), Orders (ClipboardList), Agents (Truck), Customers (Users), Partners (Building2), Coupons (Ticket), Pricing (IndianRupee)
    - Active link: gold text + gold left border + forest-light background
    - Inactive: cream/muted text
    - Bottom section: admin name from auth store + logout button
    - Smooth hover transitions on all links
    - CSS as a separate Sidebar.css file co-located

16. CREATE src/components/layout/Topbar.tsx:
    - Horizontal bar at top of content area, height var(--topbar-height), white background, subtle bottom border
    - Left: page title (passed as prop or derived from location)
    - Right: admin name + small avatar circle with initials + logout dropdown
    - CSS as Topbar.css

17. CREATE src/components/layout/AppLayout.tsx:
    - Uses CSS Grid: grid-template-columns var(--sidebar-width) 1fr
    - Left column: <Sidebar />
    - Right column: <Topbar /> on top + <main> area with <Outlet /> (react-router)
    - Main content area: padding 24px, overflow-y auto, height calc(100vh - var(--topbar-height))

18. CREATE src/pages/LoginPage.tsx:
    - Full viewport page, background: forest dark (#0F2E2A) with subtle gradient
    - Centered card (max-width 420px): white background, rounded 16px, shadow, padding 40px
    - RapidDry logo at top (text based: "RAPIDRY" in gold, "Admin Dashboard" in muted)
    - Email input field with label
    - Password input field with label + show/hide toggle
    - "Sign In" button: full width, gold background (#D6B97B), forest dark text, rounded 8px, hover darkens
    - Loading state on button during API call
    - Error message display below button (red text)
    - On success: redirect to / using react-router navigate
    - CSS as LoginPage.css

19. REWRITE src/App.tsx:
    - BrowserRouter with Routes setup
    - Public route: /login → <LoginPage />
    - ProtectedRoute wrapper component:
      - Uses authStore to check isAuthenticated
      - On mount: if token exists but user is null, call checkAuth()
      - While loading: show full-page loading spinner
      - If not authenticated: Navigate to /login
      - If authenticated but user.role !== 'admin': show "Access Denied" message
      - If authenticated and admin: render <AppLayout /> which contains <Outlet />
    - Protected routes (nested inside ProtectedRoute):
      / → <DashboardPage />
      /orders → <OrdersPage />
      /agents → <AgentsPage />
      /customers → <CustomersPage />
      /partners → <PartnersPage />
      /coupons → <CouponsPage />
      /pricing → <PricingPage />
    - For now, create placeholder pages that just show the page name as h1

20. REWRITE src/main.tsx:
    - Import index.css
    - Render App inside StrictMode

21. DELETE old files: src/App.css, src/assets/hero.png, src/assets/react.svg, src/assets/vite.svg (keep only if needed)

DESIGN RULES:
- Use vanilla CSS (no Tailwind), one .css file per component
- Forest dark sidebar, cream content area, gold accents on interactive elements
- Playfair Display for page titles/headings, DM Sans for everything else
- All transitions: 200ms ease
- Border radius: 8px for cards, 12px for modals, 999px for badges

VERIFY:
- npm run dev starts without errors
- /login shows the login form on forest dark background
- Enter admin@rapidry.in / Rapidry@2026 → redirects to /
- / shows sidebar + topbar + "Dashboard" placeholder
- Clicking sidebar links navigates between placeholder pages
- Refresh on any page → stays logged in (token persisted)
- Logout → redirects to /login → can't access / directly
```

---

## PHASE 2 — Reusable UI Components

```
Continuing the Rapidry admin dashboard build.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

CURRENT STATE (from Phase 1, all working):
- Login page with JWT auth
- Sidebar + Topbar + AppLayout shell
- API layer connecting to backend at localhost:3000
- All TypeScript types defined
- Zustand auth store
- Placeholder pages for all routes
- Design tokens in CSS variables

DESIGN TOKENS (already in CSS variables):
  Colors: --color-forest-dark #0F2E2A, --color-gold #D6B97B, --color-cream #F3EFE6, --color-text-primary #0F2E2A, --color-text-secondary #4A5568, --color-text-muted #9CAB9A, --color-success #15803D, --color-warning #D6B97B, --color-error #991B1B, --color-info #1E3A5F
  Fonts: --font-display 'Playfair Display', --font-body 'DM Sans'

NOW BUILD THESE REUSABLE UI COMPONENTS in src/components/ui/:

1. CREATE StatCard.tsx + StatCard.css:
   Props: { icon: LucideIcon, label: string, value: string | number, trend?: string, trendUp?: boolean, color?: string }
   - White card, rounded 12px, padding 20px, subtle shadow (0 1px 3px rgba(0,0,0,0.08))
   - Left: icon in a 44px colored circle (color prop with 15% opacity background)
   - Right: label in muted text (12px uppercase), value in large text (28px, DM Sans 700), trend in small text with green/red color + ↑/↓ arrow
   - Hover: very subtle lift (translateY -1px, shadow increase)

2. CREATE StatusBadge.tsx + StatusBadge.css:
   Props: { status: OrderStatus | PaymentStatus | 'online' | 'offline' | 'active' | 'suspended' }
   - Renders a pill (border-radius 999px, padding 4px 12px, font-size 12px, font-weight 600)
   - Color mapping:
     placed → bg #E8EEF5, text #1E3A5F, label "Placed"
     agent_assigned → bg #FFF3CD, text #6B4C00, label "Agent Assigned"
     picked_up → bg #EDE8F5, text #4A2C8A, label "Picked Up"
     processing → bg #E0F2FE, text #0C4A6E, label "Processing"
     ready → bg #D9F2E4, text #15803D, label "Ready"
     out_for_delivery → bg #F5EDDA, text #7C5A00, label "Out for Delivery"
     delivered → bg #D9F2E4, text #15803D, label "Delivered"
     cancelled → bg #FEE2E2, text #991B1B, label "Cancelled"
     pending → bg #FFF3CD, text #6B4C00, label "Pending"
     paid → bg #D9F2E4, text #15803D, label "Paid"
     failed → bg #FEE2E2, text #991B1B, label "Failed"
     refunded → bg #E8EEF5, text #1E3A5F, label "Refunded"
     online → bg #D9F2E4, text #15803D, label "● Online"
     offline → bg #F3F4F6, text #6B7280, label "● Offline"
     active → bg #D9F2E4, text #15803D, label "Active"
     suspended → bg #FEE2E2, text #991B1B, label "Suspended"

3. CREATE DataTable.tsx + DataTable.css:
   Generic component using @tanstack/react-table v8.
   Props: { columns: ColumnDef<T>[], data: T[], isLoading?: boolean, onRowClick?: (row: T) => void, emptyMessage?: string }
   Features:
   - Sortable column headers (click to toggle, show ↑↓ icons)
   - Row hover: light cream background
   - Sticky header
   - Loading state: 5 skeleton rows with pulse animation
   - Empty state: centered message with icon
   - Clean table styling: no outer border, light row separator lines, header bg slightly darker cream
   - Responsive: horizontal scroll wrapper on small screens

4. CREATE SearchInput.tsx + SearchInput.css:
   Props: { value: string, onChange: (value: string) => void, placeholder?: string }
   - Search icon (Search from lucide) on left inside the input
   - 300ms debounce on onChange
   - Clear button (X) when value is non-empty
   - Styled: white background, 1px border #EAE4D8, rounded 8px, padding 8px 12px 8px 36px
   - Focus: border color gold

5. CREATE FilterBar.tsx + FilterBar.css:
   Props: { filters: { status?, dateFrom?, dateTo?, search? }, onChange: (filters) => void, statusOptions: { value, label }[] }
   - Horizontal flex row with gap 12px, wraps on mobile
   - Contains: <SearchInput />, status <select> dropdown, date from <input type="date">, date to <input type="date">, Clear All button
   - Select dropdown styled to match: white bg, border, rounded, padding

6. CREATE Modal.tsx + Modal.css:
   Props: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode, width?: string }
   - Backdrop: fixed inset, bg rgba(15,46,42,0.5), backdrop-filter blur(4px), z-index 1000
   - Modal card: centered (flex), white bg, rounded 16px, padding 24px, max-height 90vh, overflow-y auto
   - Header: title (DM Sans 600, 18px) + close X button
   - Animate: fade in + scale from 0.95 to 1 (200ms)
   - Close on backdrop click + Escape key

7. CREATE Drawer.tsx + Drawer.css:
   Props: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }
   - Backdrop: same as Modal
   - Panel: fixed right, width 520px, height 100vh, white bg, overflow-y auto
   - Header: title + close X button, sticky top, white bg, bottom border, z-index 1
   - Animate: slide in from right (transform translateX 100% → 0, 250ms ease)
   - Close on backdrop click + Escape key

8. CREATE Pagination.tsx + Pagination.css:
   Props: { page: number, totalPages: number, total: number, limit: number, onChange: (page: number) => void }
   - Flex row: "Showing X-Y of Z" text on left, page buttons on right
   - Buttons: Prev, page numbers (show max 5, ellipsis for gaps), Next
   - Active page: gold bg, white text
   - Disabled prev/next when on first/last page

9. CREATE LoadingSpinner.tsx + LoadingSpinner.css:
   Props: { size?: 'sm' | 'md' | 'lg', text?: string }
   - CSS-only spinner: border-based circular animation
   - Color: gold (#D6B97B)
   - If text: spinner + text below centered
   - Full page variant: centered in viewport (used for auth check)

10. CREATE EmptyState.tsx + EmptyState.css:
    Props: { icon?: LucideIcon, title: string, description?: string }
    - Centered flex column, padding 48px
    - Large icon (48px) in muted color
    - Title in 18px semibold
    - Description in muted text

11. CREATE ConfirmDialog.tsx:
    Uses <Modal> internally.
    Props: { isOpen, onClose, onConfirm, title, message, confirmText?, confirmColor?, isLoading? }
    - Title in bold, message in regular text
    - Two buttons: Cancel (outlined) + Confirm (filled, default red for destructive)
    - Loading state on confirm button

DESIGN RULES FOR ALL COMPONENTS:
- Each component gets its own .css file (co-located)
- Use CSS variables from index.css throughout
- All interactive elements: cursor pointer + transition 200ms ease
- Focus states: outline 2px solid var(--color-gold) with 2px offset
- Consistent font: DM Sans for body, Playfair Display only for page-level headings
- Card shadows: 0 1px 3px rgba(0,0,0,0.08) for default, 0 4px 12px rgba(0,0,0,0.1) for elevated

VERIFY:
- All files compile without TypeScript errors
- npm run dev works without errors
- Components are importable (we'll use them in Phase 3)
```

---

## PHASE 3 — Dashboard Page + Orders Page

```
Continuing the Rapidry admin dashboard build.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

CURRENT STATE (Phase 1 + Phase 2 complete):
- Login + auth working, sidebar + topbar layout
- All UI components built: StatCard, StatusBadge, DataTable, SearchInput, FilterBar, Modal, Drawer, Pagination, LoadingSpinner, EmptyState, ConfirmDialog
- API layer: adminApi in src/services/admin.api.ts
- Types defined for all entities

BACKEND API RESPONSES (for reference):

GET /admin/dashboard returns:
{ orders_today: 12, revenue_today: 4580.50, active_agents: 3, pending_pickups: 5 }

GET /admin/analytics returns:
{ labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], revenue: [3200,4100,2800,5600,4200,6100,4580], orders: [8,12,7,15,11,16,12] }

GET /admin/orders?status=placed&search=nayan&page=1&limit=20 returns:
{ orders: [{ id, order_number, status, total, payment_status, created_at, customer_name, customer_phone, item_count, agent_name }], total: 45, page: 1, limit: 20 }

GET /admin/orders/:id returns:
{ id, order_number, status, total, delivery_fee, discount, payment_status, payment_method, pickup_date, pickup_slot, special_instructions, created_at, customer: { id, name, phone, email }, address: { full_address, landmark, label }, items: [{ id, quantity, unit_price, total_price, service_name }], payment: { razorpay_payment_id, amount, method, status }, deliveries: [{ type, status, agent_name, agent_phone, started_at, completed_at }], notifications: [{ title, body, created_at }] }

GET /admin/agents returns:
[{ id, user_id, name, phone, email, is_active, is_online, zone, rating, total_deliveries, today_delivery_count }]

NOW BUILD:

1. CREATE src/hooks/useDashboardStats.ts:
   - React state hook that fetches adminApi.getDashboardStats() on mount
   - Returns { stats, isLoading, error, refetch }

2. CREATE src/hooks/useOrders.ts:
   - Takes filter params: { status?, dateFrom?, dateTo?, search?, page?, limit? }
   - Fetches adminApi.getOrders(params) — refetches when params change
   - Returns { orders, total, page, isLoading, error, refetch }

3. CREATE src/hooks/useAgents.ts:
   - Fetches adminApi.getAgents() on mount
   - Returns { agents, isLoading, refetch }

4. CREATE src/components/charts/RevenueChart.tsx + RevenueChart.css:
   - Uses recharts <ResponsiveContainer> + <LineChart>
   - Line color: gold (#D6B97B), stroke width 2, dot fill gold
   - Grid lines: very subtle cream-dark
   - X-axis: day labels (Mon-Sun), Y-axis: ₹ values
   - Tooltip styled with white bg, forest dark text, shadow
   - Cart area gradient fill (gold with 20% opacity)
   - Wrapped in white card with padding, rounded 12px
   - Title: "Revenue (Last 7 Days)" in DM Sans 600 16px

5. CREATE src/components/charts/OrderVolumeChart.tsx + OrderVolumeChart.css:
   - Uses <ResponsiveContainer> + <BarChart>
   - Bar color: forestLight (#1E4D47), bar radius top 4px
   - Same axis + tooltip styling as revenue chart
   - Wrapped in white card
   - Title: "Orders (Last 7 Days)"

6. CREATE src/components/orders/OrdersTable.tsx:
   - Uses <DataTable> with these columns:
     Column 1: "Order #" → order_number (monospace font, bold)
     Column 2: "Customer" → customer_name (main) + customer_phone (secondary, muted, smaller)
     Column 3: "Items" → item_count
     Column 4: "Total" → ₹ formatted with toLocaleString('en-IN')
     Column 5: "Status" → <StatusBadge status={row.status} />
     Column 6: "Payment" → <StatusBadge status={row.payment_status} />
     Column 7: "Agent" → agent_name or "Unassigned" in muted italic
     Column 8: "Date" → format(created_at, 'dd MMM yyyy, hh:mm a') using date-fns
   - Props: { orders, isLoading, onRowClick }

7. CREATE src/components/orders/OrderTimeline.tsx + OrderTimeline.css:
   - Props: { currentStatus: OrderStatus, deliveries: Delivery[], createdAt: string }
   - Vertical timeline with circles and connecting lines
   - Status steps in order: placed → agent_assigned → picked_up → processing → ready → out_for_delivery → delivered
   - Completed steps: gold circle with checkmark, gold connecting line
   - Current step: gold circle pulsing
   - Future steps: gray circle, gray dashed line
   - Each step shows: status label + timestamp if available (from deliveries/notifications)
   - If status is 'cancelled': show cancelled badge in red at current position

8. CREATE src/components/orders/OrderDetailDrawer.tsx + OrderDetailDrawer.css:
   - Uses <Drawer> component
   - Props: { orderId: string | null, isOpen: boolean, onClose: () => void, onAssign: () => void }
   - On open: fetch adminApi.getOrderDetail(orderId)
   - Loading state while fetching
   - Sections with clear separators (1px cream-dark borders):
     a) Header: "Order #RD-00042" + <StatusBadge> + date
     b) Customer: name, phone, email (clickable tel: and mailto: links)
     c) Address: full_address + landmark + label badge
     d) Items: list with name, qty, unit_price, line total. Bottom row: subtotal
     e) Price summary: subtotal | delivery fee | discount (if any) | TOTAL (bold, larger)
     f) Payment: method badge + status badge + razorpay ID
     g) Timeline: <OrderTimeline /> component
     h) Deliveries: for each delivery → agent name, phone, type badge, status
   - Action buttons at bottom (sticky):
     "Assign Agent" gold button — only visible if status is 'placed' (triggers onAssign)
   - Style: clean white sections, subtle borders, good spacing

9. CREATE src/components/orders/AssignAgentModal.tsx + AssignAgentModal.css:
   - Uses <Modal>
   - Props: { isOpen, onClose, orderId: string, onAssigned: () => void }
   - On open: fetch agents list using adminApi.getAgents()
   - Show dropdown of ONLINE agents only (filter is_online === true)
   - Each option shows: name + phone + today's delivery count
   - If no agents online: show message "No agents are currently online"
   - "Assign" gold button → calls adminApi.assignAgent(orderId, selectedAgentId)
   - On success: show success message, call onAssigned(), close modal
   - Loading state on assign button

10. REWRITE src/pages/DashboardPage.tsx + CREATE DashboardPage.css:
    Layout (top to bottom):
    a) Page header: "Dashboard" title (Playfair Display, 24px)
    b) Stats row: 4x <StatCard> in CSS grid (4 columns, gap 20px, responsive: 2 cols on tablet, 1 on mobile)
       - Orders Today: Package icon, value from stats.orders_today
       - Revenue Today: IndianRupee icon, ₹ formatted value
       - Active Agents: Users icon
       - Pending Pickups: Clock icon
    c) Charts row: 2-column grid (gap 20px, stack on mobile)
       - <RevenueChart data={analytics} />
       - <OrderVolumeChart data={analytics} />
    d) Recent Orders section:
       - Sub-header: "Recent Orders" + "View All →" link to /orders
       - <OrdersTable> with first 5 orders (limit=5)
       - Click row → navigate to /orders (or open drawer)
    - Fetch data using useDashboardStats hook + manual analytics fetch

11. REWRITE src/pages/OrdersPage.tsx + CREATE OrdersPage.css:
    Layout:
    a) Page header: "Orders" title
    b) <FilterBar> with status options (all 8 order statuses), date range, search
    c) <OrdersTable> with full order data
    d) <Pagination> at bottom
    e) <OrderDetailDrawer> (controlled by selected order state)
    f) <AssignAgentModal> (controlled by state)
    
    State management:
    - filters: { status, dateFrom, dateTo, search }
    - page: current page number
    - selectedOrderId: string | null (for drawer)
    - showAssignModal: boolean
    
    Flow:
    - Change filter → reset page to 1 → refetch
    - Click row → set selectedOrderId → open drawer
    - In drawer, click "Assign Agent" → open AssignAgentModal
    - After assign → close modal → refetch orders → refresh drawer

VERIFY:
- Dashboard shows 4 stat cards with real data from backend
- Revenue and Order charts render with 7-day data
- Recent orders table shows 5 orders
- Orders page: table loads with 20 orders
- Filter by status "placed" → only placed orders shown
- Search "nayan" → filters by customer name
- Click an order row → drawer slides in → shows full order detail
- If order is "placed" → "Assign Agent" button visible → click → modal opens → select agent → assign → success
- Pagination: next/prev works, page numbers update
```

---

## PHASE 4 — Agents, Customers & Partners Pages

```
Continuing the Rapidry admin dashboard build.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

CURRENT STATE (Phase 1-3 complete):
- Login, auth, layout shell all working
- All reusable UI components built
- Dashboard page with stats + charts + recent orders
- Orders page with filters, table, drawer, assign agent modal

BACKEND API RESPONSES:

GET /admin/agents returns:
[{ id, user_id, name, phone, email, is_active, is_online, zone, rating, total_deliveries, today_delivery_count }]

POST /admin/agents body { name, phone, email?, zone? } returns:
{ id, user_id, is_online, zone, rating, total_deliveries, user: { id, name, phone, email, role, is_active } }

PATCH /admin/agents/:id/suspend returns:
{ success: true, message: "Agent suspended successfully" }

GET /admin/customers?search=X&page=1&limit=20 returns:
{ customers: [{ id, name, phone, email, is_active, created_at, order_count, total_spent }], total: 150, page: 1, limit: 20 }

GET /admin/partners returns:
[{ id, name, phone, email, zone, is_active, user_id, user_name, user_phone, user_is_active, order_count, order_value_total }]

NOW BUILD:

1. CREATE src/components/agents/AgentsTable.tsx:
   - Uses <DataTable>
   - Columns:
     "Name" → name (font-weight 600)
     "Phone" → phone
     "Status" → <StatusBadge status={is_online ? 'online' : 'offline'} />
     "Zone" → zone or "—" in muted
     "Rating" → ⭐ {rating.toFixed(1)} (gold star icon)
     "Total Deliveries" → total_deliveries formatted with comma
     "Today" → today_delivery_count (bold if > 0)
     "Account" → <StatusBadge status={is_active ? 'active' : 'suspended'} />
     "Actions" → Suspend button (red outline, small) — only show if is_active is true

2. CREATE src/components/agents/AddAgentModal.tsx + AddAgentModal.css:
   - Uses <Modal> with title "Add New Agent"
   - Form fields:
     Name: text input, required, min 2 chars
     Phone: text input, required, pattern /^[6-9]\d{9}$/ (Indian mobile), show "+91" prefix
     Email: email input, optional
     Zone: text input, optional, placeholder "e.g. Sector 5, Gurgaon"
   - Validation: show inline error messages below fields on submit attempt
   - "Add Agent" gold button → calls adminApi.createAgent(data)
   - Loading state on button
   - On success: show success toast/message, close modal, call onCreated callback
   - On error: show error message

3. CREATE src/components/agents/AgentDetailModal.tsx + AgentDetailModal.css:
   - Uses <Modal> with title = agent name
   - Shows agent details in card sections:
     Contact: name, phone, email
     Performance: rating (star display), total deliveries, today count
     Status: online/offline badge, active/suspended badge, zone
   - "Suspend Agent" red button at bottom (only if is_active)
   - Uses <ConfirmDialog> internally for suspend confirmation
   - On confirm suspend → adminApi.suspendAgent(id) → refetch → close

4. REWRITE src/pages/AgentsPage.tsx + CREATE AgentsPage.css:
   Layout:
   a) Page header: "Agents" title + "Add Agent" gold button (Plus icon)
   b) Quick stats row (optional): Total agents count, Online count, Suspended count — derived from agents array
   c) <AgentsTable> with all agents
   d) Click agent row → open <AgentDetailModal>
   e) "Add Agent" button → open <AddAgentModal>
   
   State: agents (from useAgents hook), selectedAgent, showAddModal
   After add/suspend: refetch agents list

5. CREATE src/components/customers/CustomersTable.tsx:
   - Uses <DataTable>
   - Columns:
     "Name" → name (font-weight 600) — show "—" if null
     "Phone" → phone
     "Email" → email or "—"
     "Orders" → order_count (right-aligned)
     "Total Spent" → ₹ total_spent formatted (right-aligned, font-weight 600)
     "Joined" → format(created_at, 'dd MMM yyyy') using date-fns
     "Status" → <StatusBadge status={is_active ? 'active' : 'suspended'} />

6. CREATE src/hooks/useCustomers.ts:
   - Takes params: { search?, page?, limit? }
   - Fetches adminApi.getCustomers(params), refetches on param change
   - Returns { customers, total, page, isLoading, refetch }

7. REWRITE src/pages/CustomersPage.tsx + CREATE CustomersPage.css:
   Layout:
   a) Page header: "Customers" title + total count badge
   b) <SearchInput> placeholder "Search by name or phone..."
   c) <CustomersTable> with customer data
   d) <Pagination> at bottom
   
   State: search string, page number
   Search change → reset page to 1 → debounced refetch

8. CREATE src/components/partners/PartnersTable.tsx:
   - Uses <DataTable>
   - Columns:
     "Name" → name (font-weight 600)
     "Phone" → phone
     "Zone" → zone or "—"
     "Orders" → order_count
     "Revenue" → ₹ order_value_total formatted
     "Status" → <StatusBadge status={is_active ? 'active' : 'suspended'} />

9. REWRITE src/pages/PartnersPage.tsx + CREATE PartnersPage.css:
   Layout:
   a) Page header: "Partners" title
   b) <PartnersTable> with partners data
   
   Fetch: adminApi.getPartners() on mount

STYLING CONSISTENCY:
- All page headers: same flex layout (title left, action button right)
- All tables: same white card container with rounded 12px, padding 0, shadow
- Page padding: 0 (AppLayout already provides 24px padding on main)
- Section spacing: 20px gap between sections

VERIFY:
- Agents page: table shows agents with online/offline badges
- Click "Add Agent" → modal opens → fill form → submit → new agent in table
- Click agent row → detail modal → shows stats → click suspend → confirm → agent shows "Suspended"
- Customers page: table loads with pagination
- Search customer → results filter → clear search → all results back
- Pagination: clicking pages refetches with correct offset
- Partners page: table loads with partner data and revenue totals
```

---

## PHASE 5 — Coupons Page + Pricing Page

```
Continuing the Rapidry admin dashboard build.
Project: /Volumes/Crucial/LaundryApp-Project/admin-dashboard/

CURRENT STATE (Phase 1-4 complete):
- Full working dashboard: login, dashboard, orders, agents, customers, partners
- All reusable components built and tested

BACKEND API RESPONSES:

GET /admin/coupons returns:
[{ id, code, discount_type, discount_value, min_order, max_discount, expires_at, usage_limit, used_count, is_active, usage_percent, created_at }]

POST /admin/coupons body { code, discount_type, discount_value, min_order?, max_discount?, expires_at?, usage_limit?, is_active? } returns:
{ id, code, discount_type, discount_value, ... }

GET /services returns:
[{ id, name, description, icon_url, is_active }]

GET /services/:id/items returns:
[{ id, service_id, name, price, unit }]

PUT /admin/services/:id body { price } returns:
{ id, service_id, name, price, unit }

NOW BUILD:

1. CREATE src/hooks/useCoupons.ts:
   - Fetches adminApi.getCoupons() on mount
   - Returns { coupons, isLoading, refetch }

2. CREATE src/components/coupons/CouponsTable.tsx:
   - Uses <DataTable>
   - Columns:
     "Code" → code (monospace font: 'JetBrains Mono' or 'Courier New', font-weight 700, letter-spacing 0.5px, background #F5EDDA padding 4px 8px rounded 4px — makes it look like a code tag)
     "Type" → discount_type === 'flat' ? '₹ Flat' : '% Percent'
     "Value" → discount_type === 'flat' ? ₹ + discount_value : discount_value + '%'
     "Min Order" → ₹ min_order (or "—" if 0)
     "Max Discount" → ₹ max_discount (or "No limit")
     "Usage" → custom cell: "used_count / usage_limit" text + a small progress bar below (div with width based on usage_percent, gold bg, 4px height, rounded). If usage_limit is null → show "used_count / ∞"
     "Expires" → if expires_at: format(date, 'dd MMM yyyy'). If past: show in red. If null: "Never"
     "Status" → is_active ? green "Active" badge : gray "Inactive" badge

3. CREATE src/components/coupons/CreateCouponModal.tsx + CreateCouponModal.css:
   - Uses <Modal> with title "Create Coupon"
   - Width: 480px
   - Form fields:
     Code: text input, required, auto-converts to UPPERCASE on input, placeholder "e.g. WELCOME50"
     Discount Type: select dropdown with options "Flat (₹)" and "Percent (%)"
     Discount Value: number input, required, > 0. Label changes based on type: "Flat Amount (₹)" or "Percentage (%)"
     Min Order Amount: number input, optional, default 0, prefix "₹"
     Max Discount: number input, optional, prefix "₹" — only show this field if discount_type is 'percent'
     Expires At: date input (type="date"), optional. Min date = today
     Usage Limit: number input, optional, placeholder "Unlimited if empty"
   
   - Show live coupon preview card below the form:
     ┌───────────────────────────────────┐
     │  [CODE]        50% OFF           │
     │  Min order ₹200 · Max ₹100 off  │
     │  Expires: 30 Apr 2026            │
     └───────────────────────────────────┘
   
   - Submit button: "Create Coupon" (gold, full width)
   - Validation: code required + unique-ish check (just frontend required), value > 0, percent <= 100
   - On submit → adminApi.createCoupon(data) → on success → close + refetch
   - Loading state + error display

4. REWRITE src/pages/CouponsPage.tsx + CREATE CouponsPage.css:
   Layout:
   a) Page header: "Coupons" title + "Create Coupon" gold button (Plus icon)
   b) Quick stat: "X active coupons" count derived from filtered array
   c) <CouponsTable> 
   d) <CreateCouponModal> controlled by state
   
   After coupon creation: refetch coupons list

5. CREATE src/components/pricing/PricingTable.tsx + PricingTable.css:
   Props: { services: Service[], serviceItems: Record<string, ServiceItem[]>, onPriceUpdate: (itemId, newPrice) => Promise<void> }
   
   Renders services grouped as sections:
   - Each service = a section with header (service name, description)
   - Under each service: a table of its items
   
   Table columns:
     "Item" → item.name (font-weight 500)
     "Unit" → item.unit === 'per_item' ? 'Per Piece' : 'Per KG'
     "Price" → INLINE EDITABLE CELL:
       Default state: shows "₹ {price}" with a small pencil icon on hover
       Edit state (on click): shows a small input field with the price + a green ✓ button + red ✗ button
       On ✓ or Enter: call onPriceUpdate(itemId, newPrice) → show brief "Saved ✓" flash → return to default state
       On ✗ or Escape: cancel edit → return to default state
       Validation: price must be > 0
       Loading state: show small spinner replacing ✓ while saving
   
   Section styling:
   - Each service section: white card, rounded 12px, margin-bottom 20px
   - Service name: DM Sans 600 16px, description below in muted text
   - Table inside the card, no outer borders

6. REWRITE src/pages/PricingPage.tsx + CREATE PricingPage.css:
   Layout:
   a) Page header: "Service Pricing" title
   b) Instructions text: "Click on any price to edit it. Changes are saved immediately." (muted text)
   c) <PricingTable> with all services and their items
   
   Data loading:
   - On mount: fetch adminApi.getServices() → for each service, fetch adminApi.getServiceItems(serviceId)
   - Store in state: services array + serviceItems map (serviceId → items[])
   - Loading state while fetching
   
   Price update handler:
   - async function handlePriceUpdate(itemId, newPrice):
     - Call adminApi.updateServicePricing(itemId, newPrice)
     - On success: update local state to reflect new price
     - On error: show error toast, revert to old price

FINAL POLISH FOR ALL PAGES:
- Consistent page header style across all pages
- Toast/notification system for success/error messages (can be a simple absolute-positioned message that auto-dismisses after 3 seconds — create a simple Toast component if not already present, or use a lightweight state-based approach)
- Loading states on all data fetches
- Empty states when no data

VERIFY:
- Coupons page: table loads all coupons with progress bars for usage
- Click "Create Coupon" → modal opens → fill form → see live preview → submit → new coupon appears in table
- Change discount type to percent → "Max Discount" field appears
- Code auto-uppercases as you type
- Pricing page: all services grouped with their items
- Hover a price → pencil icon appears
- Click price → edit mode → change value → press Enter → "Saved ✓" flash → new price shown
- Press Escape → edit cancelled, old price restored
- Try entering 0 or negative → validation prevents save
- All pages responsive: check at 1024px and 768px widths

AFTER ALL PHASES COMPLETE:
Full working admin dashboard with:
✅ Login with email/password
✅ Dashboard with stats + charts
✅ Orders management with filters, detail drawer, agent assignment
✅ Agents management with add/suspend
✅ Customers list with search + pagination  
✅ Partners list
✅ Coupons management with create
✅ Service pricing with inline editing
```

---

## Summary

| Phase | What It Builds | Key Files |
|-------|---------------|-----------|
| **0** | Backend admin-login endpoint | 1 migration + 1 seed + auth controller/routes |
| **1** | Foundation: types, API, auth, layout, login, routing | ~20 files |
| **2** | Reusable UI components | ~11 components |
| **3** | Dashboard page + Orders page (most complex) | 6 components + 2 pages |
| **4** | Agents + Customers + Partners pages | 5 components + 3 pages |
| **5** | Coupons + Pricing pages | 4 components + 2 pages |
