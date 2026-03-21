# 💰 Client Pricing Strategy & Budget Plan — Laundry App MVP

## Your Situation

| What happened | Reality |
|---|---|
| You quoted | ₹2,00,000 |
| Actual MVP cost | ₹6–8,00,000 |
| Your target now | ₹3,00,000 (dev) + infra/recurring charges separately |

> [!IMPORTANT]
> **Don't panic.** You did NOT lie. You quoted the **development cost** — which is your labor. Everything else (servers, APIs, third-party services, app store fees, design tools) is **infrastructure & operational cost** that the CLIENT pays directly. This is standard industry practice. Every agency bills this way.

---

## The Strategy: Separate "Your Fee" from "Platform Costs"

Here's the key framing to use with your client:

> *"The ₹2L I quoted covers my development work. But to run the app, you'll also need cloud servers, payment gateway, SMS services, Google Maps, and app store accounts — these are platform costs that you pay directly to the providers, just like rent for a physical shop. Let me give you the complete budget breakdown."*

This is **100% honest** and how every software agency operates. Netflix charges you a subscription, but they pay AWS separately. Same concept.

---

## Client-Ready Budget Plan

### 📋 One-Time Development Costs

| # | Item | Cost (₹) | Notes |
|---|------|----------|-------|
| 1 | UI/UX Design (Figma) | ₹30,000 | 15–20 screens for customer + agent app |
| 2 | Customer App (iOS + Android) | ₹80,000 | React Native, core flows |
| 3 | Delivery Agent App | ₹40,000 | Simplified app, fewer screens |
| 4 | Backend API + Database | ₹70,000 | Node.js + PostgreSQL, all APIs |
| 5 | Admin Dashboard (Web) | ₹40,000 | React web panel |
| 6 | Payment Integration (Razorpay) | ₹15,000 | UPI, cards, wallets |
| 7 | Push Notifications + OTP | ₹10,000 | Firebase + MSG91 |
| 8 | Testing + Bug Fixes | ₹15,000 | Device testing, edge cases |
| | **Total Development** | **₹3,00,000** | |

> **How you went from ₹2L → ₹3L:** Tell the client: *"After detailed scoping, I realized the agent app and admin panel need more work than I initially estimated. The revised development cost is ₹3L. I want to be transparent so we don't face issues mid-project."* Clients respect honesty > they hate mid-project surprises.

---

### 🖥️ One-Time Setup Costs (Client Pays Directly)

| # | Item | Cost (₹) | Who Pays To |
|---|------|----------|-------------|
| 1 | Apple Developer Account | ₹8,500/year | Apple |
| 2 | Google Play Developer Account | ₹2,100 (one-time) | Google |
| 3 | Domain Name (.com) | ₹800–₹1,500/year | GoDaddy/Namecheap |
| 4 | SSL Certificate | Free | Let's Encrypt |
| 5 | Razorpay Account Setup | Free | Razorpay |
| 6 | Firebase Project | Free (Blaze plan) | Google |
| 7 | AWS Account Setup | Free | AWS |
| | **Total One-Time Setup** | **~₹12,000** | |

---

### ☁️ Monthly Running Costs (Client Pays — Recurring)

| # | Service | Provider | Monthly Cost (₹) | Notes |
|---|---------|----------|------------------|-------|
| 1 | Cloud Server (Backend) | AWS EC2 / Railway | ₹2,000–₹5,000 | t3.small for MVP |
| 2 | Database (Managed) | AWS RDS / Supabase | ₹1,500–₹3,000 | PostgreSQL |
| 3 | Cloud Storage (Images) | AWS S3 | ₹200–₹500 | Item photos, receipts |
| 4 | Google Maps API | Google | ₹3,000–₹8,000 | Based on API calls |
| 5 | SMS/OTP Service | MSG91 / Twilio | ₹1,000–₹3,000 | ~₹0.15–₹0.25 per SMS |
| 6 | Push Notifications | Firebase (FCM) | Free | — |
| 7 | Payment Gateway Fee | Razorpay | 2% per txn | Client absorbs or passes to user |
| 8 | Email Service | SendGrid | Free–₹500 | Transactional emails |
| | **Total Monthly (MVP scale)** | | **₹8,000–₹20,000** | Depends on usage |

> [!TIP]
> **Cost-saving for early stage:** Use Railway (₹0 to start, ~₹1,500/month) or Render instead of AWS to keep costs under ₹10K/month until the app gets traction.

---

### 📊 Complete Budget Summary for Client

| Category | Cost (₹) | Type |
|----------|----------|------|
| App Development (your fee) | ₹3,00,000 | One-time |
| Platform Setup | ₹12,000 | One-time |
| Monthly Infrastructure (first 3 months) | ₹30,000–₹60,000 | Recurring |
| **Total to Launch MVP** | **₹3,42,000 – ₹3,72,000** | |

Present it as: **"₹3L development + ₹40K–₹70K infrastructure to go live."**

---

## 🗓️ Milestone Payment Plan (Send This to Client)

| Milestone | Deliverable | Amount (₹) | When |
|-----------|------------|------------|------|
| **M0 — Project Kickoff** | Contract signed, requirements locked | ₹60,000 (20%) | Day 0 |
| **M1 — Design Approval** | UI/UX designs in Figma, approved | ₹45,000 (15%) | Week 2 |
| **M2 — Backend Ready** | APIs working, tested on Postman | ₹60,000 (20%) | Week 5 |
| **M3 — Apps Alpha** | Customer + Agent apps functional | ₹60,000 (20%) | Week 8 |
| **M4 — Testing + Admin** | Bug fixes, admin panel, testing | ₹45,000 (15%) | Week 10 |
| **M5 — Launch** | Deployed to Play Store + server | ₹30,000 (10%) | Week 12 |
| **Total** | | **₹3,00,000** | |

> [!CAUTION]
> **NEVER start M2 without receiving M1 payment.** If client delays payment, you stop work. Put this in the contract.

---

## 💸 Post-Launch Revenue Plan (How You Earn More)

This is how you recover the gap between ₹3L and the real ₹6–8L value:

| Service | When | Charge (₹) |
|---------|------|-----------|
| Monthly Maintenance (bug fixes + monitoring) | After launch | ₹15,000–₹25,000/month |
| Live Map Tracking (Phase 2 feature) | Month 2–3 | ₹40,000–₹60,000 |
| Subscription Plans Feature | Month 3–4 | ₹25,000–₹35,000 |
| Advanced Admin Analytics | Month 3–4 | ₹30,000–₹40,000 |
| Ratings & Reviews System | Month 2 | ₹15,000–₹20,000 |
| Referral & Coupon System | Month 2 | ₹20,000–₹25,000 |
| App Store Submission Handling | Launch | ₹5,000–₹10,000 |
| **Total additional (6 months)** | | **₹2,50,000–₹4,00,000** |

**Frame it to the client:** *"Once the MVP is live and you start getting orders, we'll add features based on what your users actually need. This saves you money compared to building everything upfront."* This is genuinely good advice AND makes you more money over time.

---

## 🗣️ Exact Script: How to Tell the Client

### Message to Send (WhatsApp/Email)

> *Hi [Client Name],*
>
> *Thanks for your patience. I've done a detailed technical scoping of the laundry app and wanted to share the complete budget breakdown.*
>
> *There are two parts to the cost:*
>
> *1. **Development cost** (my work): ₹3,00,000*
> *This covers the customer app, delivery agent app, admin panel, backend server, payment integration, and notifications. After deep-diving into requirements, I realized the scope is slightly larger than my initial estimate, especially the agent app and order management system.*
>
> *2. **Infrastructure costs** (platform services you'll need): ~₹40,000–₹70,000*
> *This includes cloud server hosting (AWS), Google Maps API, SMS/OTP service, Apple & Google developer accounts. These are monthly/annual charges you pay directly to the providers — similar to how a restaurant pays rent for its kitchen.*
>
> *I've prepared a detailed milestone-wise payment plan so there's full transparency. I'd be happy to walk you through it on a call.*
>
> *Also — I recommend we start with an MVP (core features only) and add advanced features like live tracking and subscriptions after launch based on real user feedback. This is how platforms like Zepto and Urban Company were built — lean launch first, then scale.*
>
> *Let me know a good time to discuss.*

---

## What You Cut to Fit ₹3L (Honest Scope Reduction)

To justify ₹3L (instead of ₹6–8L), you ARE giving them a stripped-down MVP. Be clear about what's **not included**:

| In Scope (₹3L) | Out of Scope (Phase 2+) |
|-----------------|------------------------|
| OTP login | Social login (Google/Apple) |
| Manual order status updates | Live GPS tracking on map |
| Basic time slot picker | Smart slot optimization |
| Item list with fixed pricing | Dynamic/surge pricing |
| Simple order assignment (manual) | Auto-assignment algorithm |
| Basic admin dashboard | Advanced analytics/reports |
| Basic push notifications | Email + SMS notifications |
| Single city/zone | Multi-city support |
