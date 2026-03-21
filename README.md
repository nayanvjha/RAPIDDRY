# Rapidry — On-Demand Laundry Platform

> A Zepto-style on-demand laundry pickup & delivery platform connecting Customers, Delivery Agents, and Laundry Partners.

## Project Structure

```
├── backend/            # Node.js + Express REST API
├── customer-app/       # React Native (Expo) — Customer mobile app
├── agent-app/          # React Native (Expo) — Delivery agent mobile app
├── admin-dashboard/    # React + Vite — Admin web dashboard
├── partner-panel/      # React + Vite — Laundry partner web panel
├── design-reference/   # Figma design system export (reference only)
└── research/           # SRS, planning docs, pitch materials
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile Apps | React Native (Expo) |
| Web Dashboards | React + Vite |
| Backend API | Node.js + Express.js |
| Database | PostgreSQL (Supabase) |
| Auth | Firebase Authentication (Phone OTP) |
| Payments | Razorpay |
| Maps | Google Maps SDK + Places API |
| Push Notifications | Firebase Cloud Messaging (FCM) |

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # Starts on http://localhost:3000
```

### Customer App
```bash
cd customer-app
npm install
npx expo start
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev             # Starts on http://localhost:5173
```

### Partner Panel
```bash
cd partner-panel
npm install
npm run dev             # Starts on http://localhost:5174
```

## Design System

See `design-reference/guidelines/Guidelines.md` for the complete design system documentation including colors, typography, spacing, and component rules.

**Key Design Tokens:**
- Primary: Forest Dark `#0F2E2A`
- Accent: Gold `#D6B97B`
- Surface: Cream `#F3EFE6`
- Fonts: Playfair Display (headings) + DM Sans (body)
