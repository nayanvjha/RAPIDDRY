# RAPIDRY — Change Request Document
## Option B: Include Barcode-Based Laundry Management System in MVP

**Prepared by:** Nayan Kumar
**Date:** 21 March 2026
**For:** Mr. Nishant Sarawgi, Rapidry Pvt. Ltd.
**Reference:** Software Development Agreement dated 16 March 2026
**CR Number:** CR-001
**Status:** Pending Client Approval

---

## 1. Purpose

This document is a formal **Change Request (CR)** as per **Clause 9** of the signed Software Development Agreement. The client has requested the inclusion of a **Barcode-Based Laundry Management System** — covering barcode generation, item-level tracking, sorting, and misplacement prevention — within the MVP scope.

This document provides: the full feature list, scope comparison, effort breakdown, revised pricing, and updated timeline.

---

## 2. Current MVP vs Expanded MVP — Side-by-Side Comparison

### 2.1 Laundry Partner Panel — Feature Comparison

| Feature | Current MVP (₹2L) | Expanded MVP (with Barcode System) | Difficulty |
|---------|-------------------|-----------------------------------|------------|
| **Order receiving** | View order list from dashboard | Receive + scan + tag every item with barcode | 🟢 → 🟡 |
| **Item tracking** | Checkbox-based (manual tick per item) | Barcode scan-based at 7 stages (Received → Washing → Drying → Ironing → QC → Packed → Ready) | 🟢 → 🔴 |
| **Order board** | 3-column Kanban (Received → Processing → Ready) | 7-stage pipeline with barcode-gated transitions | 🟢 → 🔴 |
| **Barcode generation** | ❌ Not included | ✅ Unique barcode/QR per garment with encoded order data | N/A → 🟡 |
| **Tag printing** | ❌ Not included | ✅ Thermal printer integration (Zebra/TSC) for sticker labels | N/A → 🔴 |
| **Barcode scanning** | ❌ Not included | ✅ Camera-based + USB/Bluetooth handheld scanner support | N/A → 🟡 |
| **Sorting system** | ❌ Not included | ✅ Auto-sort by service type, priority (Express/Normal), color, fabric | N/A → 🟡 |
| **Misplacement prevention** | ❌ Not included | ✅ Mandatory scan at handover, wrong-order alerts, missing item alerts, daily reconciliation | N/A → 🔴 |
| **Dispatch verification** | One-tap "Ready" button | Scan-and-verify all items before handover. System blocks dispatch if items are missing. | 🟢 → 🟡 |
| **Damage flagging** | Photo upload + text notes | Photo upload + text notes + linked to specific barcode tag | 🟢 → 🟢 |
| **Staff management** | ❌ Not included | ✅ Staff login (PIN-based), role assignment, action logging | N/A → 🟡 |
| **Reports** | ❌ Not included | ✅ Processing time per item type, misplacement rate, staff performance, daily volume | N/A → 🟡 |

> 🟢 = Simple &nbsp;&nbsp; 🟡 = Medium Complexity &nbsp;&nbsp; 🔴 = High Complexity

### 2.2 Complexity Impact on Overall Project

| Metric | Current MVP | Expanded MVP | Change |
|--------|-------------|-------------|--------|
| **Total screens** | 21 screens | 21 + 8 new screens = **29 screens** | +38% |
| **Backend API endpoints** | 35+ endpoints | 35 + 15 new = **50+ endpoints** | +43% |
| **Database tables** | 13 tables | 13 + 5 new = **18 tables** | +38% |
| **Development hours** | ~415 hours | ~415 + 180 = **~595 hours** | +43% |
| **Timeline** | 12 weeks | 12 + 4 = **16 weeks** | +4 weeks |
| **Hardware required** | None (software only) | Thermal printer + barcode scanner + label rolls | New cost |

---

## 3. Additional Features — Detailed Breakdown

### 3.1 Barcode Generation & Tagging System
- Generate unique barcode (Code128) or QR code for every individual garment
- Barcode encodes: Order ID, Item Type, Service Type, Customer ID, Receive Date
- Print waterproof adhesive labels via thermal printer (ESC/POS protocol)
- Support for re-printing damaged/lost tags

### 3.2 Multi-Stage Item-Level Tracking
Every garment is scanned at each stage of processing:

```
📥 Received → 🧼 Washing → ☀️ Drying → 🔥 Ironing → ✅ Quality Check → 📦 Packed → 🚀 Ready
```

- Scan-to-advance: item cannot move to next stage without barcode scan
- Dashboard shows real-time count: "Order #RD-1042: 3/5 items ironed"
- Complete audit trail: who scanned, when, at which stage

### 3.3 Sorting Dashboard
- After tagging, system auto-suggests sorting bins:
  - By **service type**: Wash & Fold pile, Wash & Iron pile, Dry Clean pile
  - By **priority**: Express orders (red flag) vs Standard
  - By **color**: Lights vs Darks (to prevent color bleeding)
- Batch creation for efficient machine loading

### 3.4 Misplacement Prevention System
- **Mandatory scan rule**: No item moves between stages without a scan
- **Wrong-order alert**: If Customer A's shirt is scanned into Customer B's dispatch → immediate red alert + audio beep
- **Missing item alert**: If an item hasn't been scanned in 24 hours → notification to manager
- **Dispatch verification**: Before handing to delivery agent, all items must be scanned. System shows: "5/5 items verified ✅" or "4/5 scanned — 1 MISSING ❌"
- **Daily reconciliation report**: End-of-day summary of all pending/untracked items

### 3.5 Staff Management
- PIN-based staff login (4-digit code — simple for non-tech workers)
- Every scan action is logged with staff ID
- Performance dashboard: items processed per staff per day

### 3.6 Processing Analytics
- Average processing time by item type (e.g., shirts: 2 hrs, sarees: 4 hrs)
- Daily/weekly volume trends
- Misplacement incident rate (target: <0.5%)
- Bottleneck identification (which stage is slowest?)

---

## 4. Additional New Screens (8 Screens)

| # | Screen | Type | Description |
|---|--------|------|-------------|
| 1 | Receiving & Tagging Station | Partner Panel | Scan items, generate barcodes, print tags, log details |
| 2 | Barcode Scanner View | Partner Panel | Camera/scanner interface for scanning items at any stage |
| 3 | Sorting Dashboard | Partner Panel | Visual sorting bins with auto-suggestions |
| 4 | Processing Pipeline (7-stage) | Partner Panel | Extended Kanban with barcode-gated stage transitions |
| 5 | Item Detail View | Partner Panel | Full history of a single item (all scans, stages, photos) |
| 6 | Dispatch Verification | Partner Panel | Scan-all-items checkout before agent handover |
| 7 | Staff Management | Partner Panel | Staff list, add/remove, PIN management |
| 8 | Processing Reports | Partner Panel | Charts and tables: volume, time, misplacement stats |

---

## 5. Additional Database Schema

| Table | Purpose |
|-------|---------|
| `item_tags` | Stores barcode value, item metadata, linked to order_items |
| `item_tracking` | Scan log — who scanned, which stage, when, where |
| `batches` | Groups items for machine loading (washing batch, ironing batch) |
| `misplacement_alerts` | Log of wrong-order / missing items with resolution status |
| `staff` | Laundry shop staff — name, PIN, role, active status |

---

## 6. Revised Pricing

### 6.1 Development Cost Breakdown

| Module | Current MVP (₹) | Additional for Barcode System (₹) |
|--------|-----------------|----------------------------------|
| UI/UX Design (Figma) | 15,000 | +8,000 (8 new screens) |
| Customer App | 60,000 | — (no change) |
| Agent App | 30,000 | — (no change) |
| Backend APIs + Database | 50,000 | +30,000 (15 new APIs, 5 tables) |
| Admin Dashboard | 25,000 | — (no change) |
| Partner Panel (basic → full) | 10,000 | +28,000 (8 screens, scanner, printer) |
| Payment + Notifications | 5,000 | — (no change) |
| Testing + Bug Fixes | 5,000 | +9,000 (barcode hardware testing) |
| **Total** | **₹2,00,000** | **+₹75,000** |

### 6.2 Revised Total

| | Amount (₹) |
|---|---|
| Original MVP Agreement | ₹2,00,000 |
| Barcode System Addition (CR-001) | +₹75,000 |
| **Revised Total** | **₹2,75,000** |

> **Effective increase: 37.5%** for a **43% increase in project scope**. This reflects fair pricing — the developer is absorbing a portion of the additional effort to keep costs reasonable for an early-stage startup.

### 6.3 Market Rate Comparison

To put this in perspective:

| Provider | Barcode Management Module Cost | Source |
|----------|-------------------------------|--------|
| Freelancer (India, mid-level) | ₹1,00,000–₹1,50,000 | Upwork / Freelancer.com |
| Small agency (India) | ₹2,00,000–₹3,50,000 | Clutch.co listed agencies |
| SaaS product (pre-built) | ₹50,000–₹80,000/year subscription | Clean Cloud, QDC, Starchup |
| **This quote** | **₹75,000 (one-time, custom-built, integrated)** | **Below market — startup-friendly rate** |

---

## 7. Revised Payment Schedule

| Milestone | Week | Deliverable | Amount (₹) |
|-----------|------|------------|------------|
| **M0 — Project Kickoff** | Week 0 | Agreement signed, SRS approved | ₹45,000 |
| **M1 — Design Approved** | Week 2 | 29 Figma screens (21 original + 8 new) | ₹35,000 |
| **M2 — Backend Live** | Week 6 | All 50+ APIs on staging, including barcode system | ₹50,000 |
| **M3 — Apps on Device** | Week 9 | Customer + Agent apps on Android device | ₹45,000 |
| **M4 — Panels Complete** | Week 12 | Admin Dashboard + Full Partner Panel with barcode | ₹40,000 |
| **M4.5 — Barcode Testing** | Week 14 | Barcode system tested with real printer + scanner | ₹35,000 |
| **M5 — Launch** | Week 16 | Play Store live, production server, source code | ₹25,000 |
| **Total** | **16 weeks** | | **₹2,75,000** |

---

## 8. Revised Timeline

```
Week 1–2     ─→  Requirements + UI/UX Design (29 screens)
Week 3–6     ─→  Backend API + Database (50+ endpoints, 18 tables)
Week 6–9     ─→  Customer App + Agent App
Week 9–12    ─→  Admin Dashboard + Partner Panel (basic features)
Week 12–14   ─→  Barcode System (generation, scanning, tracking, printer integration)  ← NEW
Week 14–15   ─→  Integration Testing + Barcode Hardware Testing  ← NEW
Week 15–16   ─→  Deployment + Play Store
```

**Total: 16 weeks (4 months)** — increased from 12 weeks due to additional scope.

---

## 9. Hardware Requirements (Client's Responsibility)

These are one-time purchases paid directly by the client:

| Item | Recommended Model | Cost (₹) | Notes |
|------|------------------|----------|-------|
| Thermal Barcode Printer | TVS LP 46 Lite / Zebra ZD220 | ₹8,000–₹15,000 | Prints adhesive barcode stickers |
| Handheld Barcode Scanner | Honeywell Voyager 1200g | ₹3,000–₹5,000 | USB wired, plug-and-play |
| Barcode Label Rolls | 38mm × 25mm, 2000 labels/roll | ₹400–₹800/roll | Water-resistant recommended |
| Tablet (if not available) | Samsung Galaxy Tab A8 | ₹15,000–₹18,000 | For running Partner Panel |
| **Total Hardware** | | **₹11,400–₹20,800** | One-time purchase |

---

## 10. What Client Gets — Final Comparison

| Capability | Without Barcode (₹2L) | With Barcode (₹2.75L) |
|------------|----------------------|----------------------|
| Customer can place orders | ✅ | ✅ |
| Agent picks up & delivers | ✅ | ✅ |
| Admin manages everything | ✅ | ✅ |
| Partner sees orders on Kanban | ✅ (3 columns) | ✅ (7 stages) |
| Item tracking | Manual checkbox | **Barcode scan at every stage** |
| Misplacement risk | Relies on manual diligence | **System-enforced prevention** |
| Wrong-order detection | ❌ None | **✅ Instant alert** |
| Missing item detection | ❌ None | **✅ Auto-alert after 24hrs** |
| Dispatch accuracy | Hope-based ✋ | **Scan-verified ✅** |
| Sorting help | ❌ None | **✅ Auto-sort suggestions** |
| Staff accountability | ❌ None | **✅ Every action logged** |
| Processing analytics | ❌ None | **✅ Time, volume, efficiency** |
| **Investment** | **₹2,00,000** | **₹2,75,000** |
| **Timeline** | **12 weeks** | **16 weeks** |

> **For ₹75,000 more (just 37.5% increase), the platform transforms from a basic order management tool into a complete enterprise-grade laundry operations system with zero-misplacement guarantee.**

---

## 11. Approval

This Change Request is submitted per **Clause 9** of the Software Development Agreement. As per **Clause 9.2**, work on the barcode system will begin after:

1. ✅ Client's written approval of this CR (WhatsApp or email)
2. ✅ Receipt of 50% CR advance: ₹37,500

**Remaining ₹37,500** adjusted into the revised milestone schedule above.

---

| | Signature | Date |
|---|---|---|
| **Developer — Nayan Kumar** | ___________________ | ___________________ |
| **Client — Nishant Sarawgi** | ___________________ | ___________________ |

---

*Prepared by Nayan Kumar | Contact: +91 76676 25880 | jhavatsak217@gmail.com*
*This document is confidential and intended solely for the use of the client.*
