# PROJECT PROPOSAL
## On-Demand Laundry & Ironing Service — Mobile Application (MVP)

---

**Prepared by:** Nayan Kumar
**Date:** 11 March 2026
**Version:** 1.0
**Confidential** — For client review only

---

## About Me

I am a mobile application developer specializing in building on-demand service platforms. My professional experience includes:

- **Startup Development at IIT Delhi** — Working with early-stage startups on product engineering and mobile-first platforms
- **Corporate Engineering at Bosch** — Experience with enterprise-grade software systems, quality standards, and production-level development practices
- Building real-world applications across **React Native, Node.js, and cloud infrastructure**

I bring a blend of startup speed and corporate-grade reliability to every project I deliver.

---

## Project Overview

### What We're Building
A **Zepto-style mobile platform** for laundry and ironing services — where customers can book laundry pickup from their doorstep, choose services (wash, iron, dry clean), track their order, and receive clean clothes back via delivery.

### Who Uses the Platform

| User | Interface |
|------|-----------|
| Customer | Mobile App (Android + iOS) |
| Delivery Agent | Mobile App (Android + iOS) |
| Laundry Partner | Web Dashboard |
| Admin (You) | Web Dashboard |

---

## MVP Scope — What's Included

### ✅ Customer App

| # | Feature | Description |
|---|---------|-------------|
| 1 | OTP Login | Secure phone-based authentication |
| 2 | Service Catalog | Browse wash, iron, dry clean with per-item pricing |
| 3 | Address Management | Save addresses with auto-detect location |
| 4 | Time Slot Booking | Select date and time slot for pickup |
| 5 | Order Placement | Add items to cart, review, and confirm |
| 6 | Payment Gateway | Online payment via UPI, cards, wallets (Razorpay) |
| 7 | Order Status Tracking | Real-time status: Placed → Picked Up → Processing → Out for Delivery → Delivered |
| 8 | Push Notifications | Instant alerts for every order status change |
| 9 | Order History | View past orders with option to re-order |
| 10 | Profile Management | Edit name, phone, saved addresses |

### ✅ Delivery Agent App

| # | Feature |
|---|---------|
| 1 | Agent login & verification |
| 2 | View assigned pickup/delivery tasks |
| 3 | Navigation to customer/partner location |
| 4 | Update order status at each step |
| 5 | Item count & handover confirmation |
| 6 | Basic earnings summary |

### ✅ Admin Dashboard (Web)

| # | Feature |
|---|---------|
| 1 | View & manage all orders |
| 2 | Manage customers, agents, and partners |
| 3 | Assign delivery agents to orders |
| 4 | Service & pricing configuration |
| 5 | Basic revenue & order reports |

### ✅ Laundry Partner Panel (Web — Basic)

| # | Feature |
|---|---------|
| 1 | View assigned orders |
| 2 | Update processing status per order |
| 3 | Mark order as ready for return pickup |

### ✅ Backend & Infrastructure

| # | Component |
|---|-----------|
| 1 | Backend API server (Node.js + Express) |
| 2 | Database design & setup (PostgreSQL) |
| 3 | User authentication (Firebase Auth — OTP) |
| 4 | Payment gateway integration (Razorpay) |
| 5 | Push notification system (Firebase Cloud Messaging) |
| 6 | Cloud deployment & server setup |
| 7 | API documentation for all endpoints |

---

## ❌ What's NOT in MVP Scope

The following features are **not included** in the ₹3,00,000 MVP budget. They can be added in Phase 2 after launch:

| Feature | Reason for Exclusion |
|---------|---------------------|
| Live GPS map tracking | Requires real-time WebSocket infrastructure |
| Social login (Google/Apple) | Not critical for launch |
| Subscription plans | Business model needs validation first |
| In-app chat support | Can use WhatsApp support initially |
| AI recommendations | Needs user data to be useful |
| Surge/dynamic pricing | Not needed at launch scale |
| Multi-city support | Focus on one city first |
| Rating & review system | Phase 2 addition |
| Advanced analytics dashboard | Phase 2 addition |
| iOS App Store submission | Can be added as separate service |

> **Note:** Excluding non-essential features at this stage is an industry best practice. Companies like Uber, Zepto, and Urban Company all launched with stripped-down MVPs and added features after validating user demand. This approach saves cost and time.

---

## Cost Breakdown — Complete Transparency

### Development Cost (My Fee)

| Module | Effort (Hours) | Cost (₹) |
|--------|---------------|----------|
| UI/UX Design (Figma — all screens) | 40 hrs | 30,000 |
| Customer Mobile App | 110 hrs | 80,000 |
| Delivery Agent Mobile App | 55 hrs | 40,000 |
| Backend APIs + Database | 100 hrs | 70,000 |
| Admin Web Dashboard | 55 hrs | 40,000 |
| Laundry Partner Panel (Basic) | 20 hrs | 15,000 |
| Payment + Notifications Integration | 15 hrs | 10,000 |
| Testing + Bug Fixes | 20 hrs | 15,000 |
| **Total** | **~415 hours** | **₹3,00,000** |

**Effective hourly rate: ~₹720/hr ($8.5/hr)** — significantly below industry average of ₹1,500–₹3,000/hr for mid-level Indian developers. You're getting startup-grade quality at a highly competitive rate.

---

### Hardware & Equipment Cost (One-Time)

Development, testing, and deployment of a production application requires dedicated high-speed storage for source code, build environments, database backups, and project assets.

| Item | Specification | Cost (₹) | Purpose |
|------|--------------|----------|---------|
| NVMe SSD (Dedicated Project Storage) | Crucial 500GB NVMe | ₹4,500 | Source code, builds, local database, backups, testing environments |

> This is a one-time hardware investment required for fast development builds and secure local data storage. It remains dedicated to this project throughout the development lifecycle.

---

### Infrastructure Costs (Paid Directly to Providers)

These are **not my charges** — these are third-party platform fees that any app requires to run, similar to electricity and rent for a physical business.

| Service | Provider | Cost | Frequency |
|---------|----------|------|-----------|
| Apple Developer Account | Apple | ₹8,500 | Per year |
| Google Play Developer Account | Google | ₹2,100 | One-time |
| Domain Name (.com) | GoDaddy/Namecheap | ₹800–₹1,500 | Per year |
| SSL Certificate | Let's Encrypt | Free | — |
| Cloud Server (Backend Hosting) | AWS / Railway | ₹2,000–₹5,000 | Per month |
| Database Hosting | Supabase / AWS RDS | ₹1,500–₹3,000 | Per month |
| Google Maps API | Google | ₹3,000–₹8,000 | Per month (usage-based) |
| SMS / OTP Service | MSG91 | ₹1,000–₹2,000 | Per month |
| Push Notifications | Firebase (FCM) | Free | — |
| Payment Gateway Fee | Razorpay | 2% per transaction | Per transaction |
| **Monthly Running Cost (est.)** | | **₹8,000–₹18,000** | **Per month** |

> **Cost-saving approach:** For the first 3–6 months, we'll use free-tier and low-cost options (Railway, Supabase free tier, Firebase) to keep running costs under ₹10,000/month until the app gains traction.

---

## Payment Schedule

| Milestone | Deliverable | Amount | Timeline |
|-----------|------------|--------|----------|
| **M0 — Project Start** | Contract signed, requirements finalized | ₹60,000 (20%) | Week 0 |
| **M1 — Design Approval** | All UI/UX designs shared in Figma for your review | ₹45,000 (15%) | Week 2 |
| **M2 — Backend Complete** | All APIs developed and tested (demo provided) | ₹60,000 (20%) | Week 5 |
| **M3 — Apps Ready** | Customer + Agent apps functional on test devices | ₹60,000 (20%) | Week 8 |
| **M4 — Testing Done** | Full testing, bug fixes, admin panel complete | ₹45,000 (15%) | Week 10 |
| **M5 — Launch** | App deployed to Play Store + server live | ₹30,000 (10%) | Week 12 |

**Total: ₹3,00,000**

> Each milestone includes a demo/review session. Payment for the current milestone is required before work on the next milestone begins.

---

## Project Timeline

```
Week 1–2    → Requirements finalization + UI/UX design
Week 3–5    → Backend API development + database
Week 5–8    → Customer app + Agent app development
Week 8–10   → Admin panel + Partner panel
Week 10–11  → Integration testing + bug fixing
Week 11–12  → Deployment + Play Store submission
```

**Total Duration: 12 weeks (3 months)**

---

## Post-Launch Support

### Maintenance Plan (Recommended)

After launch, the app will need ongoing bug fixes, server monitoring, and minor updates to stay operational.

| Plan | What's Covered | Monthly Cost |
|------|---------------|-------------|
| **Basic** | Bug fixes + server monitoring + uptime checks | ₹15,000/month |
| **Standard** | Basic + minor feature tweaks + OS compatibility updates | ₹20,000/month |

> Maintenance is optional but strongly recommended. Without it, app-breaking bugs or server issues will have no guaranteed response time.

---

## Future Roadmap (Phase 2 & Beyond)

Once the MVP is live and validated with real users, the following features can be added based on business needs:

| Feature | Estimated Cost | Priority |
|---------|---------------|----------|
| Live GPS tracking on map | ₹40,000–₹60,000 | High |
| Rating & review system | ₹15,000–₹20,000 | High |
| Coupon & referral system | ₹20,000–₹25,000 | Medium |
| Subscription plans | ₹25,000–₹35,000 | Medium |
| Advanced analytics dashboard | ₹30,000–₹40,000 | Medium |
| In-app chat support | ₹20,000–₹30,000 | Low |
| Multi-city support | ₹30,000–₹40,000 | Low |

> These are estimated separately and can be discussed based on user feedback after launch.

---

## Why This Approach Works

1. **Launch fast, learn fast** — Get real users and real feedback within 3 months instead of spending 8+ months building everything
2. **Lower upfront risk** — ₹3L investment to validate the business model before committing ₹10L+
3. **Proven strategy** — Uber launched in just San Francisco, Zepto launched with just 2 dark stores, Urban Company started with only 3 services. Every successful platform started small.

---

## Terms & Conditions

1. Scope is limited to features listed under "MVP Scope" section above
2. Up to **2 rounds of UI design revisions** are included
3. Source code will be handed over upon final payment
4. Any feature additions outside the defined scope will be quoted separately
5. App store submission assistance for Google Play is included; Apple App Store submission can be arranged for an additional ₹5,000–₹10,000
6. Post-launch maintenance is a separate agreement

---

**Prepared by:** Nayan Kumar
**Contact:** [Your Email / Phone]
**Date:** 11 March 2026

---

*This document is confidential and intended solely for the use of the client. Redistribution without consent is not permitted.*
