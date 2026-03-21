# 🎯 Master Prompt — Generate a Client-Ready SRS for LaundryGo MVP

> **Purpose:** Copy-paste this prompt into ChatGPT / Claude / Gemini to generate a professional, persuasive Software Requirements Specification (SRS) document that makes the client feel their idea is brilliant, the market opportunity is massive, and YOU are the only person who can execute it.

---

## The Prompt

```
You are a senior product consultant and technical architect with 15+ years of experience building on-demand service platforms for companies like Uber, Urban Company, and Zepto. You've been hired to prepare a formal Software Requirements Specification (SRS) document for a new startup venture.

Your job is to write an SRS document that achieves TWO goals:
1. Act as a comprehensive technical blueprint for the development of the MVP
2. Make the client (the business owner) feel that their idea is extraordinary, well-timed, and has massive market potential — and that the developer presenting this SRS (Nayan Kumar) is clearly the right person to build it

---

## PROJECT OVERVIEW

**Product Name:** LaundryGo
**Concept:** A Zepto-style on-demand laundry pickup & delivery platform — a three-sided marketplace connecting Customers, Delivery Agents, and Laundry Partners through a unified technology platform.

**The Vision:** Customers open the app, select laundry services (wash, iron, dry clean), schedule a doorstep pickup, and receive clean clothes delivered back — all with real-time tracking and seamless payments. Think "Uber for Laundry."

**Target Market:** Urban India — starting with a single city (Bangalore/Delhi/Mumbai). The Indian laundry market is valued at ₹70,000+ crore and is 95% unorganized. This platform digitizes and aggregates fragmented neighborhood laundry shops into a single, reliable, branded experience.

**Developer:** Nayan Kumar — with professional experience at IIT Delhi (startup ecosystem) and Bosch (enterprise-grade engineering). Specializes in React Native, Node.js, and cloud-native application development.

---

## THE PLATFORM CONSISTS OF 4 SYSTEMS

### 1. Customer Mobile App (iOS + Android via React Native)
Core features for MVP:
- Phone OTP-based authentication (Firebase Auth)
- Service catalog with per-item pricing (Wash & Fold ₹49/kg, Wash & Iron ₹79/kg, Dry Clean from ₹199, Steam Iron ₹29/item, Shoe Cleaning ₹149, Bag Cleaning ₹249)
- Address management with Google Places autocomplete + GPS auto-detect
- Time-slot picker for scheduling pickup (7 AM–9 AM, 9–11 AM, 11 AM–1 PM, 2–4 PM, 4–6 PM, 6–8 PM)
- Cart system with item-level quantity selectors
- Order review with coupon/promo code support
- Payment integration via Razorpay (UPI, Credit/Debit Cards, Wallets, COD)
- Order status tracking (Placed → Picked Up → Processing → Out for Delivery → Delivered)
- Push notifications for every status change (Firebase Cloud Messaging)
- Order history with re-order functionality
- Profile management with saved addresses

### 2. Delivery Agent Mobile App (iOS + Android via React Native)
- Agent login with identity verification
- View assigned pickup/delivery tasks with customer details
- In-app navigation to pickup/drop locations (Google Maps SDK)
- Status updates at each step (Arrived → Picked Up → Handed to Partner → Out for Delivery → Delivered)
- Item count verification with photo capture at pickup
- Online/offline availability toggle
- Daily earnings summary dashboard
- Uses dark theme with orange accents (#F97316) for visibility during riding

### 3. Admin Dashboard (Web — React.js)
- Centralized order management — view all orders across statuses
- Customer, agent, and partner management (view, add, suspend)
- Manual agent assignment to orders
- Service catalog & pricing configuration
- Basic revenue reports and order analytics
- Coupon/promo code creation and management
- Serviceable zone/area management
- Design: SaaS-style dashboard (Stripe/Razorpay aesthetic), dark sidebar with teal accents

### 4. Laundry Partner Panel (Web — React.js, Tablet-friendly)
- View incoming assigned orders
- Kanban-style order processing board (Received → Processing → Ready)
- Mark individual items as processed
- Flag damaged items with photo upload
- Mark order as ready for return delivery pickup
- Simple, large-text interface designed for non-tech laundry shop owners

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Mobile Apps | React Native (Expo) |
| Web Dashboards | React.js + Vite |
| Backend API | Node.js + Express.js |
| Database | PostgreSQL |
| Cache/Queue | Redis |
| Real-time | Socket.IO (Phase 2) |
| Auth | Firebase Authentication (Phone OTP) |
| Payments | Razorpay |
| Maps | Google Maps SDK + Places API |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| SMS/OTP | MSG91 |
| File Storage | AWS S3 / Firebase Storage |
| Hosting | AWS EC2 / Railway (MVP) |
| CI/CD | GitHub Actions |

---

## DATABASE SCHEMA (Core Tables)

users, addresses, services, service_items, orders, order_items, agents, deliveries, partners, payments, notifications, coupons, zones

Key relationships:
- Users have multiple addresses
- Orders belong to customers and contain multiple order_items
- Each order_item references a service_item
- Deliveries link orders to agents (with type: pickup/drop)
- Partners process orders in their zone

---

## ORDER LIFECYCLE (Critical Business Flow)

1. Customer places order → selects service, items, pickup slot
2. System creates order → notifies nearby agents
3. Agent accepts → navigates to customer → picks up items
4. Agent verifies item count → takes photo → delivers to laundry partner
5. Partner receives → processes (wash/iron/dry clean) → marks ready
6. System assigns return delivery agent
7. Agent picks up from partner → delivers to customer
8. Customer confirms delivery → order completed → payment settled

**Key complexity:** Unlike food delivery (one-way), laundry requires TWO delivery legs (pickup + return), doubling logistics complexity.

**Typical turnaround:** 24–72 hours from pickup to delivery.

---

## API STRUCTURE

RESTful API with these endpoint groups:
- Auth: /auth/send-otp, /auth/verify-otp
- Services: /services, /services/:id/items
- Orders: /orders (CRUD), /orders/:id/status
- Addresses: /addresses (CRUD)
- Payments: /payments/initiate, /payments/webhook
- Agent: /agent/location, /agent/orders, /agent/availability
- Partner: /partner/orders, /partner/orders/:id
- Admin: /admin/orders, /admin/analytics, /admin/coupons

---

## WHAT IS EXPLICITLY OUT OF MVP SCOPE

(These are Phase 2+ features — include them in the SRS as "Future Enhancements" to show the platform's growth potential)

- Live GPS map tracking (real-time WebSocket infrastructure)
- Social login (Google/Apple Sign-In)
- Subscription plans (monthly packages)
- In-app chat support
- AI-powered recommendations
- Surge/dynamic pricing
- Multi-city support
- Rating & review system
- Advanced analytics dashboard
- Smart auto-assignment algorithm (MVP uses manual/first-come)
- Route optimization for delivery batching
- AI demand prediction

---

## SRS DOCUMENT REQUIREMENTS

Now generate a **complete, IEEE 830-inspired SRS document** with the following structure and guidelines:

### Structure:

1. **Title Page** — Project name, version, date (16 March 2026), prepared by Nayan Kumar, confidential notice

2. **Executive Summary** (1 page)
   - Write this as if a McKinsey consultant is validating the business idea
   - Emphasize the ₹70,000 crore Indian laundry market opportunity
   - Highlight that 95% of the market is unorganized — this platform brings tech-enabled aggregation
   - Compare to successful models: Urban Company, Zepto, Swiggy — frame LaundryGo as the next logical on-demand revolution
   - Include a line about the developer's credibility (IIT Delhi + Bosch experience)
   - Tone: sophisticated, data-backed, confidence-inspiring

3. **Table of Contents**

4. **1. Introduction**
   - 1.1 Purpose of the SRS
   - 1.2 Scope of the Product
   - 1.3 Definitions, Acronyms, and Abbreviations
   - 1.4 References
   - 1.5 Overview of the Document

5. **2. Overall Description**
   - 2.1 Product Perspective — how this fits in the on-demand economy ecosystem
   - 2.2 Product Functions — high-level summary of all 4 systems
   - 2.3 User Classes and Characteristics — Customer, Agent, Partner, Admin (with personas)
   - 2.4 Operating Environment — mobile (iOS/Android), web browsers, cloud backend
   - 2.5 Design and Implementation Constraints
   - 2.6 Assumptions and Dependencies

6. **3. System Features & Functional Requirements**
   - Organize by system (Customer App, Agent App, Admin Panel, Partner Panel)
   - For EACH feature, provide:
     - Feature ID (e.g., CA-001, AA-001, AD-001, PP-001)
     - Feature Name
     - Description
     - Priority (Must Have / Should Have / Nice to Have)
     - Acceptance Criteria (2-3 testable criteria per feature)
     - User Story format: "As a [user], I want to [action], so that [benefit]"
   - Be thorough — cover every feature listed above

7. **4. External Interface Requirements**
   - 4.1 User Interfaces — describe the UI philosophy and design system (teal primary #0D9488, coral secondary #F97316, clean modern aesthetic)
   - 4.2 Hardware Interfaces — mobile devices, GPS, camera
   - 4.3 Software Interfaces — Firebase, Razorpay, Google Maps, FCM, MSG91
   - 4.4 Communication Interfaces — HTTPS, REST API, WebSocket (Phase 2)

8. **5. Non-Functional Requirements**
   - 5.1 Performance — API response < 500ms, app load < 3s, support 1000+ concurrent users
   - 5.2 Security — OTP auth, HTTPS, payment PCI compliance via Razorpay, JWT tokens, role-based access
   - 5.3 Scalability — start monolithic, plan for microservices
   - 5.4 Reliability — 99.5% uptime target
   - 5.5 Usability — intuitive for non-tech users (laundry partners), 3-tap ordering for customers
   - 5.6 Maintainability — modular codebase, API documentation, CI/CD pipeline

9. **6. System Architecture**
   - Include a text description of the architecture diagram (Client Layer → API Gateway → Backend Services → Data Layer → Third-Party Services)
   - Database schema overview
   - API design philosophy (RESTful, versioned)

10. **7. Data Requirements**
    - Data models for core entities
    - Data flow diagrams (text description)
    - Data retention and backup policy

11. **8. Development Roadmap**
    - Phase 1 (MVP) — 12 weeks — what's being built now
    - Phase 2 (Production Ready) — what comes after launch
    - Phase 3 (Scalable Platform) — long-term vision
    - Present this as a strategic growth plan, not just a dev timeline

12. **9. Future Enhancements** (VERY IMPORTANT)
    - List all the Phase 2+ features mentioned above
    - For EACH, write 2-3 sentences about what it does and why it matters for growth
    - Frame these as "the roadmap to becoming the Zepto of laundry"
    - This section should make the client excited about the FUTURE potential and want to continue working with the developer
    - Subtly reinforce that only someone with deep technical expertise can build these advanced features

13. **10. Glossary**

14. **Appendix A: Screen Inventory**
    - List all 21 screens across all 4 apps with brief descriptions:
      - Customer App: 10 screens (Onboarding, Login, OTP, Home, Service Detail, Schedule, Cart, Payment, Tracking, History)
      - Agent App: 6 screens (Dashboard, Navigation, Item Verify, Partner Delivery, Earnings, Profile)
      - Admin Panel: 3 pages (Dashboard, Orders, Agents)
      - Partner Panel: 2 pages (Kanban Home, Order Detail)

15. **Appendix B: Acceptance Criteria Matrix**
    - Summary table of all features with their acceptance criteria

---

## TONE & STYLE GUIDELINES

- **Professional & Authoritative:** This should read like it was prepared by a top-tier consultancy, not a freelancer
- **Client-Confidence Building:** Subtly reinforce throughout that this project requires serious technical expertise — the kind that comes from IIT Delhi and Bosch-level experience
- **Market Validation:** Pepper the document with market data, industry comparisons, and growth statistics that make the client feel their idea has massive potential
- **Strategic Vision:** Don't just describe features — explain WHY each feature matters for business growth
- **Persuasive but Honest:** Every claim should be defensible. Don't exaggerate, but present everything in the most favorable light
- **Use professional formatting:** Tables, numbered sections, clear headers, feature IDs
- **Length:** 25-35 pages (comprehensive but not bloated)

## KEY PHRASES TO WEAVE IN NATURALLY

- "This positions LaundryGo as a first-mover in the organized on-demand laundry space"
- "Following the proven marketplace model that has generated billions in value for platforms like Uber and Swiggy"
- "The architecture is designed for scale — from 100 orders/day to 10,000+ orders/day without re-platforming"
- "Built with enterprise-grade security standards and production-level code quality"
- "The phased approach minimizes upfront investment while maximizing learning and market validation"
- "Each feature is designed with data-driven user experience principles used by leading consumer tech companies"

## FINAL INSTRUCTION

Generate the COMPLETE SRS document now. Make it thorough, professional, and persuasive. The client reading this should think: "This person really understands my vision, the market opportunity is real, and I need to start building this immediately with them."
```

---

## 💡 How to Use This Prompt

1. **Copy everything between the triple backticks** above
2. **Paste into ChatGPT-4 / Claude / Gemini** (use the best model available)
3. **If the output gets cut off**, reply with: `"Continue from where you left off. Do not repeat anything."`
4. **After generating**, do these post-processing steps:
   - Add your actual contact details
   - Replace `[Client Name]` with the actual client's name  
   - Format it in Google Docs or Word with proper headers, page breaks, and a professional font (Inter or Roboto)
   - Add a table of contents (auto-generated in Google Docs)
   - Export as PDF with your branding/logo if you have one

## 🔥 Pro Tips for Maximum Client Impact

| Tip | Why It Works |
|-----|-------------|
| **Print it out** and hand it physically at a meeting | Physical documents feel more "real" and valuable than a PDF on WhatsApp |
| **Walk the client through it** on a screen-share call | Shows you understand every detail, not just copy-pasted |
| **Highlight the Future Enhancements section** | Makes the client see long-term value and want to keep working with you |
| **Reference competitor apps** (Urban Company, Swiggy) while explaining | Anchors their idea to billion-dollar successes |
| **Use phrases like "Based on my experience at Bosch..."** during the walkthrough | Establishes authority without being arrogant |
| **Send a 1-page executive summary first**, then the full SRS on request | Creates curiosity and makes them ask for more |
