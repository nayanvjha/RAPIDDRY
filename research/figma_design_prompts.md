# 🎨 Figma AI Design Prompts — Laundry App MVP (M1)

> Use these prompts in **Figma AI** (or any AI design tool like Uizard, Galileo AI, Musho).
> Work through them **in order** — each phase builds on the previous one.

---

## PHASE 1 — Design System & Brand Identity

> Do this first. Every screen will inherit from this.

### Prompt 1.1 — Brand & Color System

```
Create a design system for a premium on-demand laundry service mobile app called "LaundryGo".

Brand personality: Clean, modern, trustworthy, fast.

Color palette:
- Primary: Deep teal (#0D9488) — trust and cleanliness
- Secondary: Warm coral (#F97316) — energy and urgency
- Background: Off-white (#FAFAFA) for light mode
- Surface cards: White (#FFFFFF) with subtle shadow
- Text primary: Dark charcoal (#1F2937)
- Text secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Error: Red (#EF4444)

Typography:
- Headings: Inter Bold or Poppins Semi-Bold
- Body: Inter Regular, 14-16px
- Captions: Inter Regular, 12px, gray

Create these foundational components:
1. Primary button (teal, rounded 12px, white text)
2. Secondary button (outlined, teal border)
3. Input field with label and error state
4. Bottom navigation bar (4 tabs: Home, Orders, Notifications, Profile)
5. Status badge chips (Placed, Picked Up, Processing, Delivered)
6. Service card (icon + name + price)
7. Order summary card
```

### Prompt 1.2 — App Icon & Splash Screen

```
Design a splash screen and app icon for "LaundryGo" — an on-demand laundry pickup and delivery app.

Splash screen: Centered logo with teal gradient background (#0D9488 to #14B8A6), white logo icon of a washing machine or clothes hanger, app name "LaundryGo" below in white Inter Bold.

App icon: Simple, recognizable — a stylized clothes hanger or water droplet with a shirt silhouette, teal background, white icon. Should look great at 1024x1024 and scale down to 48x48.
```

---

## PHASE 2 — Customer App (10 Screens)

### Prompt 2.1 — Onboarding & Auth (3 screens)

```
Design 3 mobile screens for a laundry service app "LaundryGo" (375x812px, iPhone size):

SCREEN 1 — Welcome / Onboarding
- Full-screen illustration of clothes being picked up from a doorstep
- Headline: "Fresh clothes, delivered to your door"
- Subtext: "Schedule laundry pickup in 60 seconds"
- CTA button: "Get Started" (teal, full-width)
- Small link: "Already have an account? Login"

SCREEN 2 — Phone Number Entry
- Headline: "Enter your phone number"
- Country code dropdown (+91 selected)
- Large phone number input field
- CTA: "Send OTP" button
- Clean white background, minimal design

SCREEN 3 — OTP Verification
- Headline: "Verify your number"
- Subtext: "Enter the 4-digit code sent to +91 98XXXXXX12"
- 4 individual OTP input boxes (auto-focus style)
- "Resend OTP" link with 30-second countdown timer
- CTA: "Verify" button

Style: Modern, clean, lots of whitespace. Use the teal primary color. Rounded corners on everything.
```

### Prompt 2.2 — Home & Service Selection (2 screens)

```
Design 2 mobile screens for "LaundryGo" app:

SCREEN 4 — Home Screen
Top section:
- "Hi, Rahul 👋" greeting
- Current address bar with pin icon and "Change" link (e.g., "HSR Layout, Bangalore")
- Search bar: "Search services..."

Middle section — Service categories as icon cards in a grid (2 columns):
- 👕 Wash & Fold — ₹49/kg
- 👔 Wash & Iron — ₹79/kg
- 🧥 Dry Clean — from ₹199
- 🔥 Steam Iron — ₹29/item
- 🧹 Shoe Cleaning — ₹149
- 🎒 Bag Cleaning — ₹249

Bottom section:
- "🔥 Special Offer" promotional banner (e.g., "First order 30% off")
- Bottom navigation: Home (active), Orders, Notifications, Profile

SCREEN 5 — Service Detail / Item Selection
- Header: "Wash & Iron" with back arrow
- Item list with + / - quantity selectors:
  • Shirt — ₹35
  • T-Shirt — ₹30
  • Trousers — ₹40
  • Jeans — ₹50
  • Saree — ₹80
  • Bedsheet — ₹60
  • Curtain — ₹100
- Each item has a small clothing icon
- Sticky bottom bar: "3 items | ₹105" with "View Cart" button

Style: Cards with subtle shadows, rounded icons, teal accent color.
```

### Prompt 2.3 — Scheduling & Checkout (3 screens)

```
Design 3 mobile screens for "LaundryGo" laundry app:

SCREEN 6 — Schedule Pickup
- Header: "Schedule Pickup" with back arrow
- Calendar strip showing next 7 days (horizontal scroll, today highlighted in teal)
- Time slots as selectable chips (2 columns):
  • 7:00 AM – 9:00 AM
  • 9:00 AM – 11:00 AM
  • 11:00 AM – 1:00 PM
  • 2:00 PM – 4:00 PM
  • 4:00 PM – 6:00 PM
  • 6:00 PM – 8:00 PM
- Selected slot highlighted in teal
- "Special Instructions" text area (optional)
- CTA: "Continue" button

SCREEN 7 — Order Review / Cart
- Header: "Order Summary"
- Delivery address card with edit icon
- Pickup slot: "Tomorrow, 9–11 AM"
- Item breakdown:
  • 2x Shirt — ₹70
  • 1x Trousers — ₹40
  • Subtotal: ₹110
  • Delivery fee: ₹30
  • Coupon discount: -₹20
  • Total: ₹120
- Coupon input field with "Apply" button
- CTA: "Proceed to Pay — ₹120"

SCREEN 8 — Payment Screen
- Header: "Payment"
- Payment methods as radio selectable cards:
  • UPI (Google Pay, PhonePe, Paytm icons)
  • Credit/Debit Card
  • Net Banking
  • Cash on Delivery
- Selected method highlighted with teal border
- Order total displayed prominently: "₹120"
- CTA: "Pay ₹120" (teal button)
- Small lock icon: "100% Secure Payment"

Style: Clean cards, clear hierarchy, trust indicators on payment screen.
```

### Prompt 2.4 — Order Tracking & History (2 screens)

```
Design 2 mobile screens for "LaundryGo" app:

SCREEN 9 — Order Tracking (Active Order)
- Header: "Order #LG-1042"
- Status stepper (vertical timeline with icons):
  ✅ Order Placed — 10:30 AM
  ✅ Agent Assigned — Ravi K. (with photo)
  ✅ Picked Up — 11:15 AM
  🔄 Processing at LaundryHub (current — pulsing dot)
  ⬜ Out for Delivery
  ⬜ Delivered
- Estimated delivery: "Tomorrow by 6 PM"
- Agent card at bottom: Ravi K. photo, rating 4.8, call button, chat button
- "Need help?" link

SCREEN 10 — Order History
- Header: "My Orders" with filter icon
- Two tabs: "Active" and "Past"
- Order cards showing:
  • Order #LG-1042 — Processing — 3 items — ₹120
  • Order #LG-1038 — Delivered — 5 items — ₹210 — "Reorder" button
  • Order #LG-1025 — Delivered — 2 items — ₹95 — "Reorder" button
- Each card has a green/yellow/gray status badge
- Bottom navigation bar

Style: Timeline with clear visual progress, green for completed steps, gray for pending.
```

---

## PHASE 3 — Delivery Agent App (6 Screens)

### Prompt 3.1 — Agent App (All 6 screens)

```
Design 6 mobile screens for the DELIVERY AGENT app of "LaundryGo" (different from the customer app — this is for delivery personnel):

Use a dark theme: Background #111827, cards #1F2937, accent orange #F97316, text white.

SCREEN 1 — Agent Home / Dashboard
- Top: Agent name, photo, online/offline toggle (green for online)
- Today's stats: 5 deliveries, ₹850 earned, 4.9 rating
- "New Order Request" alert card (pulsing):
  • Pickup: HSR Layout (1.2 km away)
  • Customer: Priya S.
  • Items: 4 items
  • Earning: ₹45
  • "Accept" (green) and "Decline" (red) buttons
  • 30-second countdown timer

SCREEN 2 — Active Task / Navigation
- Top: "Pickup from Priya S."
- Map placeholder showing route from agent to customer
- Address: "42, 14th Cross, HSR Layout, Bangalore"
- Distance: 1.2 km | ETA: 8 min
- Customer phone number with call button
- Big CTA: "Arrived at Location" (orange button)

SCREEN 3 — Item Verification at Pickup
- Header: "Verify Items"
- Customer: Priya S.
- Checklist with count selectors:
  • Shirts: [+] 2 [-]
  • T-Shirts: [+] 1 [-]
  • Trousers: [+] 1 [-]
- "Add Photo" button (camera icon) for item photo
- Total items: 4
- CTA: "Confirm Pickup" (orange button)

SCREEN 4 — Delivery to Partner
- Map showing route to laundry partner
- Partner name: "CleanWash Hub"
- Address, distance, ETA
- CTA: "Handed Over to Partner"

SCREEN 5 — Earnings Dashboard
- Header: "My Earnings"
- Toggle: Today | This Week | This Month
- Big earning number: ₹3,450 this week
- Breakdown chart or list:
  • Mon: ₹680 (8 deliveries)
  • Tue: ₹720 (9 deliveries)
  • Wed: ₹550 (6 deliveries)
- Payout info: "Next payout: ₹3,450 on Friday"

SCREEN 6 — Agent Profile
- Profile photo, name, phone
- Rating: 4.8 ⭐ (142 reviews)
- Stats: 342 deliveries, Member since Jan 2026
- Documents section: Aadhaar ✅, DL ✅
- Settings: Notification preferences, Help, Logout

Style: Dark professional theme, orange accents, large tap targets for use while riding.
```

---

## PHASE 4 — Admin Dashboard (Web)

### Prompt 4.1 — Admin Dashboard (3 pages)

```
Design a web admin dashboard for "LaundryGo" laundry service platform (1440x900px, desktop):

Dark sidebar with teal accents. Clean white content area.

PAGE 1 — Dashboard Overview
Sidebar menu: Dashboard (active), Orders, Customers, Agents, Partners, Payments, Coupons, Settings
Top bar: Search, notification bell, admin avatar

Main content:
- 4 stat cards in a row:
  • Today's Orders: 47 (+12% from yesterday)
  • Revenue Today: ₹14,200
  • Active Agents: 8/12
  • Pending Pickups: 5
- Orders chart (line graph, last 7 days)
- Recent orders table (5 rows): Order ID, Customer, Service, Status badge, Amount, Agent, Action buttons

PAGE 2 — Order Management
- Filter bar: Status dropdown, Date range, Search by order ID
- Full orders table with columns: Order ID, Customer Name, Phone, Service, Items, Status (color badge), Agent Assigned, Amount, Created At, Actions (View/Edit)
- Pagination at bottom
- Clicking a row opens order detail side panel

PAGE 3 — Agent Management
- Table: Agent Name, Photo, Phone, Status (online/offline badge), Today's Deliveries, Rating, Zone, Actions
- "Add New Agent" button (top right)
- Agent detail modal: profile, documents, delivery history, earnings

Style: Clean SaaS dashboard look. Think Stripe Dashboard or Razorpay Dashboard. Professional, data-rich, easy to scan.
```

---

## PHASE 5 — Laundry Partner Panel (Web)

### Prompt 5.1 — Partner Dashboard (2 pages)

```
Design a simple web dashboard for laundry shop partners on "LaundryGo" platform (1440x900px):

PAGE 1 — Partner Home
- Welcome: "CleanWash Hub" with status: Open ✅
- Today's summary: 6 pending, 3 in-process, 4 ready for pickup
- Order cards in 3 columns (Kanban-style):
  Column 1 — "Received" (yellow): Order cards with item list
  Column 2 — "Processing" (blue): Orders being washed
  Column 3 — "Ready" (green): Orders ready for agent pickup
- Each card shows: Order ID, item count, service type, received time
- Drag-drop or button to move between columns

PAGE 2 — Order Detail View
- Order #LG-1042
- Customer: Priya S.
- Items checklist:
  ☑ 2x Shirts — Wash & Iron
  ☑ 1x Trousers — Wash & Iron
  ☐ 1x T-Shirt — Wash & Iron (pending)
- Mark individual items as done
- "Any Issues?" button to flag damaged items with photo upload
- CTA: "Mark All Done" → moves to Ready column

Style: Simple, functional, easy for non-tech laundry shop owners. Large text, clear buttons. Works on a tablet too.
```

---

## Quick Reference — All Screens

| Phase | App | Screens | Count |
|-------|-----|---------|-------|
| 2 | Customer App | Onboarding, Login, OTP, Home, Service Detail, Schedule, Cart, Payment, Tracking, History | **10** |
| 3 | Agent App | Dashboard, Navigation, Item Verify, Partner Delivery, Earnings, Profile | **6** |
| 4 | Admin Panel | Dashboard, Orders, Agents | **3** |
| 5 | Partner Panel | Kanban Home, Order Detail | **2** |
| | | **Total** | **21 screens** |

---

## Pro Tips for Using These Prompts

1. **Do one phase at a time** — Don't paste all prompts at once
2. **After each phase, review and tweak** manually in Figma before moving on
3. **Keep the color palette consistent** — Copy Phase 1 colors into every prompt
4. **Export your Figma designs as PDF** — Send to client for M1 milestone approval
5. **Use Figma's auto-layout** — Makes your designs look more professional
