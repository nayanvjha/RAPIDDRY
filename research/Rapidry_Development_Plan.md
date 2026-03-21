# Rapidry MVP — Phased Development Plan

> **Approach:** Backend + Frontend parallel build | **Database:** Supabase (cloud PostgreSQL) | **Timeline:** 12 weeks

---

## 🏗️ PHASE 0 — Project Foundation (Day 1)

**Goal:** Set up monorepo, initialize all 5 projects, configure Git, connect Supabase.

### Step 0.1 — Create Folder Structure
- Create monorepo at `/Volumes/Crucial/LaundryApp-Project/`
- Folders: `backend/`, `customer-app/`, `agent-app/`, `admin-dashboard/`, `partner-panel/`
- Create root `.gitignore`, `README.md`

### Step 0.2 — Supabase Setup
- Create Supabase project (free tier) at [supabase.com](https://supabase.com)
- Get connection string: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`
- Note down: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- You'll use Supabase as **PostgreSQL only** (not Supabase Auth — we use Firebase Auth as per SRS)

### Step 0.3 — Backend Init
- Initialize Node.js + Express project inside `backend/`
- Install all dependencies (express, knex, pg, cors, helmet, dotenv, joi, jsonwebtoken, firebase-admin, razorpay, multer, nodemon, etc.)
- Create `.env.example` with all required environment variables
- Create basic Express app with health check route: `GET /api/v1/health`
- Connect to Supabase PostgreSQL via Knex

### Step 0.4 — Customer App Init
- Initialize Expo app inside `customer-app/` using `create-expo-app`
- Install core dependencies (expo-router, axios, zustand, react-native-maps, etc.)
- Set up navigation structure (bottom tabs: Home, Orders, Notifications, Profile)

### Step 0.5 — Git Init
- `git init` at project root
- First commit: "Project setup — monorepo structure"
- Create GitHub private repo and push

### ✅ Phase 0 Done When:
- `node src/app.js` starts server → `http://localhost:3000/api/v1/health` returns `{ status: "ok" }`
- Expo app runs on phone/emulator with bottom tab navigation
- Supabase dashboard shows connected project

---

## 🧱 PHASE 1 — Service Catalog (Week 1)

**Goal:** Customer can see all laundry services and items with pricing.
**Pattern: API banao → Test karo → Screen banao → Connect karo**

### Step 1.1 — Database: Create Tables
Write Knex migrations for first batch of tables:
- `users` — id, name, phone, email, role, firebase_uid, created_at
- `services` — id, name, description, icon_url, is_active
- `service_items` — id, service_id, name, price, unit (per_item/per_kg)

### Step 1.2 — Seed Data
Create seed file with real pricing from SRS:
- Services: Wash & Fold (₹49/kg), Wash & Iron (₹79/kg), Dry Clean (from ₹199), Steam Iron (₹29), Shoe Cleaning (₹149), Bag Cleaning (₹249)
- Service Items: Shirt ₹35, T-Shirt ₹30, Trousers ₹40, Jeans ₹50, Saree ₹80, Bedsheet ₹60, Curtain ₹100

### Step 1.3 — Backend APIs
| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/services` | List all active services with icons |
| `GET /api/v1/services/:id/items` | List items under a service with prices |

### Step 1.4 — Customer App: Home Screen (Screen 4 from Figma)
- Greeting header: "Hi, [Name] 👋"
- Address bar (hardcoded for now)
- Service cards grid (2 columns) — fetch from `/services` API
- Promotional banner (static)
- Bottom tab navigation

### Step 1.5 — Customer App: Service Detail Screen (Screen 5 from Figma)
- Item list with + / - quantity selectors — fetch from `/services/:id/items` API
- Sticky bottom bar with item count and total
- "View Cart" button

### ✅ Phase 1 Done When:
- Browser: `http://localhost:3000/api/v1/services` returns JSON array of services
- App: Home screen shows service cards fetched from API
- App: Tapping a service shows item list with correct pricing
- App: Can add/remove items, total updates correctly

---

## 🔐 PHASE 2 — Authentication (Week 1–2)

**Goal:** User can login with phone OTP via Firebase Auth.

### Step 2.1 — Firebase Setup
- Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Phone Authentication
- Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Generate Firebase Admin SDK private key (for backend verification)

### Step 2.2 — Backend APIs
| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/auth/verify-token` | Verify Firebase ID token, create/find user in DB, return JWT |
| `GET /api/v1/auth/me` | Return current user profile from JWT |

- Middleware: `authMiddleware` — verify JWT on protected routes
- On first login: create user record in `users` table with Firebase UID

### Step 2.3 — Customer App: Auth Screens (Screens 1, 2, 3 from Figma)
- **Onboarding Screen** — Welcome illustration, "Get Started" button
- **Phone Entry Screen** — +91 country code, phone input, "Send OTP" button
- **OTP Verification Screen** — 4-digit input, verify with Firebase, on success → call `/auth/verify-token` → store JWT → navigate to Home

### Step 2.4 — Auth Flow Integration
- Store JWT in secure storage (expo-secure-store)
- Add JWT to all API requests via Axios interceptor
- Auto-login check on app launch (check stored token validity)
- Logout: clear token, navigate to onboarding

### ✅ Phase 2 Done When:
- App: Enter phone → receive OTP → enter OTP → lands on Home screen
- Backend: JWT issued, subsequent API calls authenticated
- App: Reopen app → auto-logged in (no re-OTP)
- App: Logout works → redirects to onboarding

---

## 📍 PHASE 3 — Address Management (Week 2)

**Goal:** Customer can save and manage delivery addresses.

### Step 3.1 — Database
- `addresses` table — id, user_id, label ("Home"/"Work"/"Other"), lat, lng, full_address, landmark, is_default

### Step 3.2 — Backend APIs
| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/addresses` | List user's saved addresses |
| `POST /api/v1/addresses` | Add new address |
| `PATCH /api/v1/addresses/:id` | Update address |
| `DELETE /api/v1/addresses/:id` | Delete address |
| `PATCH /api/v1/addresses/:id/default` | Set as default |

### Step 3.3 — Customer App: Address Screens
- **Address input** with Google Places Autocomplete
- GPS auto-detect current location (`expo-location`)
- Save address with label (Home/Work/Other)
- Home screen top bar → tap to change/select address

### ✅ Phase 3 Done When:
- App: GPS detects location, address auto-fills
- App: Can save multiple addresses, set default
- Home screen shows current selected address

---

## 🛒 PHASE 4 — Order Placement Flow (Week 2–3)

**Goal:** Customer can schedule pickup, review cart, and place an order.

### Step 4.1 — Database
- `orders` — id, customer_id, address_id, status, total, delivery_fee, discount, payment_status, payment_method, pickup_date, pickup_slot, special_instructions, created_at
- `order_items` — id, order_id, service_item_id, quantity, unit_price, total_price
- `coupons` — id, code, discount_type (flat/percent), discount_value, min_order, expires_at, usage_limit, used_count

### Step 4.2 — Backend APIs
| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/orders` | Create new order with items, address, slot |
| `GET /api/v1/orders` | List user's orders |
| `GET /api/v1/orders/:id` | Order details |
| `POST /api/v1/coupons/validate` | Check if coupon code is valid + return discount |

### Step 4.3 — Customer App: Order Flow Screens (Screens 6, 7, 8 from Figma)
- **Schedule Pickup** (Screen 6) — Calendar strip (next 7 days) + time slot chips + special instructions
- **Order Review / Cart** (Screen 7) — Address card, items breakdown, coupon input, price summary, "Proceed to Pay"
- **Payment Screen** (Screen 8) — Payment method selection (UPI, Card, COD) — Razorpay integration comes later, use COD placeholder for now

### ✅ Phase 4 Done When:
- App: Select items → schedule time → review cart → apply coupon → place order (COD)
- Backend: Order created in DB with correct items, pricing, address
- App: Order appears in user's order list

---

## 💳 PHASE 5 — Payments (Week 3–4)

**Goal:** Integrate Razorpay for real payments.

### Step 5.1 — Razorpay Setup
- Create Razorpay account → get `KEY_ID` and `KEY_SECRET`
- Enable test mode for development

### Step 5.2 — Backend APIs
| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/payments/create-order` | Create Razorpay order, return order_id |
| `POST /api/v1/payments/verify` | Verify payment signature after completion |
| `POST /api/v1/payments/webhook` | Razorpay webhook for async payment events |

- `payments` table — id, order_id, razorpay_order_id, razorpay_payment_id, amount, method, status

### Step 5.3 — Customer App: Payment Integration
- Install `react-native-razorpay`
- On "Pay" → create Razorpay order via API → open Razorpay checkout → on success → verify → update order status
- COD option: skip Razorpay, mark payment_method as "COD"

### ✅ Phase 5 Done When:
- App: Pay via UPI/Card (test mode) → payment completes → order confirmed
- Backend: Payment record created, order status updated
- Razorpay dashboard shows test transactions

---

## 📦 PHASE 6 — Order Tracking + Notifications (Week 4–5)

**Goal:** Customer can track order status. Push notifications on every status change.

### Step 6.1 — Backend: Order Status System
- Order statuses: `placed` → `agent_assigned` → `picked_up` → `processing` → `out_for_delivery` → `delivered`
- `PATCH /api/v1/orders/:id/status` — update status (called by agent/admin)
- `notifications` table — id, user_id, title, body, type, order_id, is_read, created_at
- On every status change → create notification + send FCM push

### Step 6.2 — FCM Push Notifications Setup
- Backend: Use `firebase-admin` SDK to send FCM messages
- Customer App: Register for push notifications, save FCM token to backend
- 8 notification events per SRS (order placed, agent assigned, picked up, etc.)

### Step 6.3 — Customer App: Tracking + History Screens (Screens 9, 10 from Figma)
- **Order Tracking** (Screen 9) — Vertical timeline stepper, status badges, agent info card
- **Order History** (Screen 10) — Active/Past tabs, order cards, re-order button

### ✅ Phase 6 Done When:
- App: Order shows correct status timeline
- App: Push notification received when admin/agent changes status
- App: Order history shows past orders, re-order works

---

## 🛵 PHASE 7 — Delivery Agent App (Week 5–7)

**Goal:** Complete agent app — accept tasks, navigate, verify items, update status.

### Step 7.1 — Database
- `agents` — id, user_id, is_online, current_lat, current_lng, zone_id, rating, total_deliveries
- `deliveries` — id, order_id, agent_id, type (pickup/drop), status, started_at, completed_at

### Step 7.2 — Backend APIs
| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/auth/agent/login` | Agent login (separate from customer) |
| `PATCH /api/v1/agent/availability` | Toggle online/offline |
| `PATCH /api/v1/agent/location` | Update GPS coordinates |
| `GET /api/v1/agent/orders` | View assigned tasks |
| `PATCH /api/v1/agent/orders/:id/accept` | Accept a delivery task |
| `PATCH /api/v1/agent/orders/:id/status` | Update status (arrived, picked_up, handed_over, delivered) |
| `POST /api/v1/agent/orders/:id/verify-items` | Submit item count + photo |
| `GET /api/v1/agent/earnings` | Daily/weekly earnings summary |

### Step 7.3 — Agent App Init + All 6 Screens
- Initialize Expo project in `agent-app/`
- **Dark theme** (#111827 background, #F97316 orange accents)
- Screen 1: **Dashboard** — online/offline toggle, today's stats, new order alert card
- Screen 2: **Navigation** — Google Maps route to pickup/drop location
- Screen 3: **Item Verification** — checklist with counters + camera for photo
- Screen 4: **Partner Delivery** — map to partner, "Handed Over" button
- Screen 5: **Earnings** — daily/weekly/monthly view with breakdown
- Screen 6: **Profile** — rating, total deliveries, documents, settings

### ✅ Phase 7 Done When:
- Agent App: Login → go online → see assigned order → navigate → verify items → update status
- Customer App: status updates reflect in real-time when agent changes status
- Both apps receive push notifications at each step

---

## 🖥️ PHASE 8 — Admin Dashboard (Week 7–9)

**Goal:** Admin can manage orders, agents, partners, pricing, and coupons.

### Step 8.1 — Admin Dashboard Init
- Initialize React + Vite project in `admin-dashboard/`
- Install: react-router-dom, axios, recharts, @tanstack/react-table
- Dark sidebar + white content area design (Stripe/Razorpay aesthetic)

### Step 8.2 — Backend APIs (Admin)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/admin/dashboard` | Stats: today's orders, revenue, active agents, pending pickups |
| `GET /api/v1/admin/orders` | All orders with filters (status, date, search) |
| `GET /api/v1/admin/orders/:id` | Order detail |
| `PATCH /api/v1/admin/orders/:id/assign` | Assign agent to order |
| `GET /api/v1/admin/agents` | All agents with status |
| `POST /api/v1/admin/agents` | Add new agent |
| `PATCH /api/v1/admin/agents/:id/suspend` | Suspend agent |
| `GET /api/v1/admin/partners` | All laundry partners |
| `POST /api/v1/admin/partners` | Add new partner |
| `GET /api/v1/admin/customers` | All customers |
| `POST /api/v1/admin/coupons` | Create coupon |
| `GET /api/v1/admin/coupons` | List coupons |
| `PUT /api/v1/admin/services/:id` | Update service pricing |
| `GET /api/v1/admin/analytics` | Revenue, order volume charts |

### Step 8.3 — Admin Dashboard: 3 Pages (from Figma)
- **Page 1: Dashboard Overview** — 4 stat cards, orders line chart (7 days), recent orders table
- **Page 2: Order Management** — full filterable/searchable orders table, order detail side panel, assign agent action
- **Page 3: Agent Management** — agents table with status badges, add agent form, agent detail modal

### ✅ Phase 8 Done When:
- Admin dashboard loads with real data from APIs
- Can view all orders, filter by status/date, click to see details
- Can assign an agent to an order → agent receives notification
- Can add/suspend agents, view their performance
- Can create coupons, update service pricing

---

## 🏭 PHASE 9 — Laundry Partner Panel (Week 9–10)

**Goal:** Laundry shop owner can receive, process, and mark orders ready.

### Step 9.1 — Database
- `partners` — id, name, phone, email, address, lat, lng, zone_id, is_active, created_at

### Step 9.2 — Backend APIs (Partner)
| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/auth/partner/login` | Partner login |
| `GET /api/v1/partner/orders` | View assigned orders with status filter |
| `GET /api/v1/partner/orders/:id` | Order detail with item list |
| `PATCH /api/v1/partner/orders/:id/status` | Move order: received → processing → ready |
| `PATCH /api/v1/partner/orders/:id/items/:itemId` | Mark individual item as processed |
| `POST /api/v1/partner/orders/:id/flag` | Flag damaged item with photo + notes |
| `GET /api/v1/partner/stats` | Today's summary (pending, processing, ready counts) |

### Step 9.3 — Partner Panel Init + 2 Pages (from Figma)
- Initialize React + Vite in `partner-panel/`
- Tablet-friendly, large text, simple UI
- **Page 1: Kanban Home** — 3 columns (Received / Processing / Ready), order cards, drag or button to move
- **Page 2: Order Detail** — item checklist with checkboxes, damage flag button with photo upload, "Mark All Done" button

### ✅ Phase 9 Done When:
- Partner logs in → sees assigned orders in Kanban view
- Can move orders through stages (received → processing → ready)
- Can mark individual items as done
- Can flag damaged items with photo
- Marking "Ready" triggers notification to admin for agent assignment

---

## 🔗 PHASE 10 — End-to-End Integration (Week 10–11)

**Goal:** Test the complete order lifecycle across all 4 systems.

### Step 10.1 — Full Order Flow Test
```
Customer App: Place order (select items, schedule, pay)
    ↓ notification
Admin Dashboard: See new order → assign agent
    ↓ notification
Agent App: Accept → navigate to customer → verify items → pick up
    ↓
Agent App: Navigate to partner → hand over items
    ↓ notification
Partner Panel: See order in "Received" → process items → mark "Ready"
    ↓ notification
Admin Dashboard: See order ready → assign return delivery agent
    ↓ notification
Agent App: Pick up from partner → deliver to customer → mark "Delivered"
    ↓ notification
Customer App: Order shows "Delivered" ✅
```

### Step 10.2 — Edge Case Testing
- What if agent declines? → Order stays unassigned, admin re-assigns
- What if payment fails? → Order stays in "pending_payment" status
- What if partner flags damage? → Admin gets alert, contacts customer
- What if coupon is expired? → API returns error, app shows message
- Session expired? → Auto redirect to login

### Step 10.3 — Bug Fixes + Polish
- Fix any broken flows discovered during testing
- UI polish: loading states, error states, empty states
- Performance: API response times under 500ms

### ✅ Phase 10 Done When:
- One complete order cycle works end-to-end with no errors
- All 4 apps communicate correctly via APIs
- Push notifications received at every step

---

## 🚀 PHASE 11 — Deployment + Launch (Week 11–12)

**Goal:** Deploy everything to production, submit to Play Store.

### Step 11.1 — Backend Deployment
- Deploy Node.js backend to **Railway** (free tier → paid as needed)
- Set production environment variables (Supabase prod URL, Firebase keys, Razorpay live keys)
- Set up custom domain: `api.rapidry.in` (or similar)
- Enable HTTPS (automatic on Railway)

### Step 11.2 — Web Dashboards Deployment
- Deploy Admin Dashboard to **Vercel** (free) → `admin.rapidry.in`
- Deploy Partner Panel to **Vercel** (free) → `partner.rapidry.in`

### Step 11.3 — Mobile App Build + Play Store
- Create production Expo build: `eas build --platform android --profile production`
- Create Play Store listing (screenshots, descriptions, icon)
- Submit APK/AAB to Google Play Store
- iOS: Create TestFlight build for testing (App Store submission separate as per agreement)

### Step 11.4 — Source Code Handover Prep
- Clean up code, remove debug logs
- Write API documentation (Swagger/OpenAPI)
- Create deployment guide for client
- Final Git push, invite client to GitHub repo (after M5 payment)

### ✅ Phase 11 Done When:
- Backend live on Railway, APIs accessible via production URL
- Admin + Partner panels live on Vercel
- Android app published on Play Store
- All documentation complete

---

## 📅 Week-by-Week Summary

| Week | Backend Work | Frontend Work | Milestone |
|------|-------------|---------------|-----------|
| **1** | Phase 0 (setup) + Phase 1 (services API) + Phase 2 (auth API) | Customer App: Home screen + service detail + auth screens | — |
| **2** | Phase 3 (address APIs) + Phase 4 (order APIs) | Customer App: Address, schedule, cart, order review | M1 Design (if Figma delivery counted) |
| **3** | Phase 4 (order APIs complete) + Phase 5 (Razorpay) | Customer App: Payment screen + Razorpay integration | — |
| **4** | Phase 5 (payment webhook) + Phase 6 (tracking + FCM) | Customer App: Order tracking + History screens | — |
| **5** | Phase 6 (notifications complete) + Phase 7 (agent APIs start) | Customer App: Polish + Agent App init | M2 Backend |
| **6** | Phase 7 (agent APIs) | Agent App: Dashboard, navigation, item verify | — |
| **7** | Phase 7 (agent APIs complete) | Agent App: Earnings, profile | — |
| **8** | Phase 8 (admin APIs start) | Agent App: Polish + Admin Dashboard init | M3 Apps |
| **9** | Phase 8 (admin APIs complete) | Admin Dashboard: All 3 pages | — |
| **10** | Phase 9 (partner APIs) | Partner Panel: Kanban + Order Detail | M4 Panels |
| **11** | Phase 10 (integration testing) | Bug fixes across all apps | — |
| **12** | Phase 11 (deployment) | Play Store submission | M5 Launch 🚀 |

---

## ⚡ Quick Reference: What to Open in VS Code Each Week

| Week | Working In | Files You're Editing |
|------|-----------|---------------------|
| 1 | `backend/` + `customer-app/` | Migrations, routes, controllers, Home screen, Auth screens |
| 2–3 | `backend/` + `customer-app/` | Order APIs, address APIs, payment, cart/checkout screens |
| 4–5 | `backend/` + `customer-app/` | Notifications, FCM, tracking screen, history screen |
| 6–7 | `backend/` + `agent-app/` | Agent APIs, all 6 agent screens |
| 8–9 | `backend/` + `admin-dashboard/` | Admin APIs, dashboard pages |
| 10 | `backend/` + `partner-panel/` | Partner APIs, Kanban, order detail page |
| 11–12 | All folders | Integration testing, deployment configs |
