# Rapidry Marketing Website — Software Requirements Specification v2.0

| Field | Value |
|---|---|
| **Document** | Rapidry Marketing Website SRS v2.0 |
| **Prepared By** | Nayan Kumar |
| **Client** | Mr. Nishant Sarawgi — Rapidry Pvt. Ltd. |
| **Date** | 22 March 2026 |
| **Status** | ACTIVE — In Development |
| **Classification** | CONFIDENTIAL |

---

## 1. Project Overview

### 1.1 Purpose
A high-conversion, premium marketing website for **Rapidry** — an on-demand premium laundry service operating in Gurgaon. The website is designed to:
- Drive mobile app downloads (Play Store / App Store)
- Collect waitlist signups for new service areas
- Establish Rapidry as a premium, technology-driven brand
- Showcase the "Zepto-style" 3-hour express delivery model

### 1.2 Target Audience
- Urban working professionals (ages 22–45) in Gurgaon
- Premium apartment/society residents (Sectors 29, 44, 56, DLF, Cyber City, Golf Course Road)
- Dual-income households seeking reliable laundry services

### 1.3 Key Value Proposition
> "Your wardrobe, professionally cared for."
>
> Express pickup & delivery in as fast as 3 hours. Real-time tracking. Zero accountability issues. Premium care for every garment.

### 1.4 Benchmarks
The website should feel comparable in quality to:
- Apple.com (scroll-driven storytelling)
- Linear.app (clean dark UI + smooth animations)
- Stripe.com (glassmorphism + depth)
- Scarabynth-style creative agencies (cinematic video + centered text)

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Vite + React.js (.jsx, no TypeScript) | Vite 6.x, React 19.x |
| **3D / WebGL** | Three.js, React Three Fiber, Drei | three 0.183, R3F 9.x |
| **Animation** | GSAP (ScrollTrigger, SplitText) | gsap 3.14 |
| **Motion** | Framer Motion | 12.x |
| **Smooth Scroll** | Lenis | 1.3 |
| **Styling** | Tailwind CSS v3 + custom tokens | 3.4 |
| **Icons** | Lucide React | 0.577 |
| **Forms** | React Hook Form + EmailJS | 7.x + 4.x |
| **Video Hosting** | Cloudinary CDN | — |
| **Deployment** | Vercel (static) | — |
| **Domain** | rapidry.in | — |

### 2.1 No Backend Required
The marketing website is fully static. All data is hardcoded in `src/data/brand.js`. Form submissions are handled client-side via EmailJS. No database, no API server, no authentication.

---

## 3. Brand Identity

### 3.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `forest-dark` | `#0F2E2A` | Primary dark backgrounds |
| `forest-mid` | `#183F3A` | Cards, secondary dark bg |
| `forest-light` | `#1E4D47` | Accents, lighter dark bg |
| `gold` | `#D6B97B` | CTAs, highlights, accents |
| `gold-light` | `#E4CFA0` | Hover states, secondary gold |
| `cream` | `#F3EFE6` | Light backgrounds, body text on dark |
| `cream-dark` | `#E8E0D0` | Muted light bg |
| `charcoal` | `#1A1A1A` | Fallback dark (non-green) |

### 3.2 Typography

| Role | Font | Weight | Import |
|---|---|---|---|
| Headings | Playfair Display | Bold (700), SemiBold (600) | Google Fonts |
| Body / UI | DM Sans | Regular (400), Medium (500), SemiBold (600) | Google Fonts |

### 3.3 Brand Rules
- The word "Rapidry" is always spelled as one word with capital R
- Gold period/dot (`.`) at end of main headlines
- "professionally" in italic always when used in the hero tagline
- No mention of specific company names (EY, Bosch, NFSU) — use "Big 4" instead
- Express delivery messaging: "3 hours" not "48 hours"

---

## 4. Project Structure

```
rapidry-website/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, ScrollProgress
│   │   ├── ui/              # Shared UI (buttons, pills, accordions)
│   │   ├── three/           # Three.js components (PhoneMockup)
│   │   └── sections/        # Page sections (Hero, Services, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── data/                # Static data (brand.js)
│   ├── utils/               # Helper functions
│   ├── assets/
│   │   ├── images/
│   │   ├── svg/
│   │   └── videos/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example
└── package.json
```

---

## 5. Page Sections (Top to Bottom)

### 5.1 Navbar (`layout/Navbar.jsx`)

| Property | Specification |
|---|---|
| Position | Fixed top, `z-50` |
| Default state | `bg rgba(15,46,42,0.7)`, `backdrop-blur-xl` |
| Scrolled state | `bg rgba(15,46,42,0.95)`, `backdrop-blur-xl` |
| Logo | "RAPIDRY" text in Playfair Display Bold, white, with gold hanger icon |
| Nav links | Services, How It Works, Coverage, Reviews, Download — white text |
| Right side | "WhatsApp us" (green dot + text) + "Get the App" gold pill button |
| Mobile | Hamburger menu → full-screen overlay with all links |
| Transition | Background transitions on scroll via `useEffect` + scroll listener |

---

### 5.2 Hero Section (`sections/Hero.jsx`)

**Layout:** Full viewport (100vh), centered content, NO scroll pinning.

**Background Layers (bottom to top):**

1. **Video background** (THE STAR):
   - `src`: `https://res.cloudinary.com/dpoa1psmc/video/upload/v1774170228/download_fdstec.mp4`
   - `autoPlay muted loop playsInline`
   - `objectFit: cover`, full viewport
   - `opacity: 1` — video is fully visible, NOT dimmed
   - Fallback poster: dark charcoal gradient (`#1A1A1A`)

2. **Subtle dark gradient overlay** (for text readability only):
   ```css
   background: linear-gradient(
     to bottom,
     rgba(0,0,0,0.15) 0%,
     rgba(0,0,0,0.1) 40%,
     rgba(0,0,0,0.5) 80%,
     rgba(0,0,0,0.7) 100%
   )
   ```
   - NO green tint overlays
   - NO `rgba(15,46,42,...)` overlays

**Content (centered, z-10):**

| Element | Spec |
|---|---|
| Eyebrow pill | "✦ Gurgaon's Premium Laundry Service" — `bg rgba(0,0,0,0.3)`, `backdrop-blur-md`, white text |
| Headline | "Your wardrobe, professionally cared for." — Playfair Display Bold, `clamp(44px, 5.5vw, 76px)`, `#FFFFFF`, `text-shadow: 0 2px 20px rgba(0,0,0,0.5)` |
| "professionally" | Italic |
| Period "." | Gold (`#D6B97B`) |
| Subtitle | "From pickup to delivery — fresh clothes at your door in as fast as 3 hours. Real-time tracking. Zero accountability issues. Premium care for every garment." — white at 85% opacity |
| CTA Primary | "Download the App" — bg gold, text forest-dark, phone icon |
| CTA Secondary | "How It Works" — border white/40, text white |
| Stats row | `500+` Happy Customers · `4.9 ★` App Rating · `3 hrs` Express Delivery |

**Entrance Animation (GSAP):**
- Headline: `y: 40, opacity: 0 → visible`, duration 1s, delay 0.5s
- Subtitle: delay 0.8s
- CTAs: delay 1.0s
- Stats: delay 1.2s
- All use `ease: 'power3.out'`

**NO scroll pinning. NO phased reveal. NO "500+ Happy Customers" giant text. Simple, clean, cinematic.**

---

### 5.3 Stats Strip (`sections/StatsStrip.jsx`)

| Stat | Value | Label |
|---|---|---|
| Market size | ₹70,000 Cr | Indian laundry market |
| Structure | 95% | Market unorganised |
| Delivery | 3 hrs | Express delivery |
| Accountability | 100% | Accountability guaranteed |

- Background: cream (`#F3EFE6`)
- Numbers: Playfair Display Bold, forest-dark
- GSAP ScrollTrigger: blur-to-sharp counter animation (start blurred, count up, become sharp)
- Gradient transition from hero (dark) → stats (cream): 100px div

---

### 5.4 Price Calculator (`sections/PriceCalculator.jsx`)

- Background: forest-dark
- Tab bar: Wash & Fold, Wash & Iron, Dry Clean, Steam Iron, Shoe Care, Bag Care
- Item grid: 2 columns, each item shows name + price + counter (−/+)
- Live total: updates instantly on quantity change
- Currency: ₹ (Indian Rupees)
- CTA: "Book This Order" gold button → links to app download
- All calculation is client-side JavaScript (no API)

---

### 5.5 How It Works (`sections/HowItWorks.jsx`)

**Layout:** 3-step visual guide on cream background.

| Step | Title | Description | Icon |
|---|---|---|---|
| 01 | Schedule a pickup | Book via app in 30 seconds. Choose your time slot. | Phone/calendar icon |
| 02 | We collect your clothes | Verified agent arrives at doorstep, checks order, safely packs. | Pickup bag icon |
| 03 | Fresh clothes delivered | Professionally cleaned, quality-checked, delivered crisp and ready. | Sparkle/shirt icon |

- Simple card grid (NOT scroll-pinned)
- Progress indicator: vertical gold line with 3 dots
- GSAP entrance: cards stagger in with `y: 80 → 0`, `opacity: 0 → 1`

---

### 5.6 Services (`sections/Services.jsx`)

**6 service cards** with 3D perspective tilt on hover:

| Service | Price | Unit | Features |
|---|---|---|---|
| Wash & Fold | ₹49 | /kg | Eco-safe detergents, fabric-separated cycles, 3-hour express delivery, precision folding |
| Wash & Iron | ₹79 | /kg | Steam-finish ironing, crease protection, hanger-ready delivery, premium garment care |
| Dry Clean | ₹199 | /item | Delicate fabric protocol, stain-specific treatment, color retention, luxury finish |
| Steam Iron | ₹29 | /item | Quick same-day slot, steam-safe pressing, no shine finish |
| Shoe Cleaning | ₹149 | /pair | Material-aware cleaning, odor neutralization, sole restoration |
| Bag Cleaning | ₹249 | /item | Interior vacuum care, surface-safe treatment, hardware polish |

**Card behavior:**
- 3D perspective tilt toward cursor (±15 degrees rotateX/rotateY)
- Spotlight glow follows cursor inside card
- Glass effect: `bg rgba(24,63,58,0.95)`, no blur on default state (cards must be SHARP)
- "BOOK NOW" gold pill button per card
- GSAP entrance: stagger `y:100→0`, `rotateX:15→0`

---

### 5.7 Coverage Map (`sections/CoverageMap.jsx`)

**Interactive grid map of Gurgaon service zones.**

- Background: cream
- Map container: dark rounded box with sector grid
- Each sector: labeled (e.g., "SEC 44"), shows active/inactive state
- Covered sectors: gold-tinted fill, gold border on hover, tooltip with stats
- Uncovered sectors: dark fill, "Coming Soon" on hover
- 3 pulse hotspots: Cyber City, DLF Phase 2, Golf Course Road
- GSAP entrance: sectors appear from center outward, stagger 0.03s
- Below: "Notify me" form for uncovered sectors

---

### 5.8 Testimonials (`sections/Testimonials.jsx`)

**Live activity ticker + testimonial cards.**

**Ticker:** Horizontal marquee scrolling left:
- "✅ Rahul's dry cleaning delivered · Sector 29"
- "⭐ Sneha rated her pickup 5 stars · Sector 66"
- "📦 12 orders picked up in DLF this morning"
- "👥 4 agents active in Cyber City"

**Cards:** 3-column grid or carousel:
| Name | Location | Quote |
|---|---|---|
| Priya Sharma | Sector 44 | "Rapidry has been flawless for my weekly office wear. Pickup is always on time and the finishing is premium." |
| Rahul Verma | DLF Phase 2 | "I shifted all my dry cleaning here. Their care for jackets and formal shirts is genuinely better than local services." |
| Ananya Singh | Cyber City | "The app updates are clear, delivery is reliable, and every item comes back perfectly packed. Highly recommended." |
| Vikram Malhotra | Golf Course Rd | "Best laundry service in Gurgaon. The express delivery in 3 hours is a game changer." |

- Cards: glassmorphism on dark bg, gold stars, avatar with initials
- Hover: scale 1.03, border brightens, shadow deepens

---

### 5.9 App Download (`sections/AppDownload.jsx`)

**Two-column layout:** Phone mockup (left) + download CTAs (right).

**Phone Mockup Options:**
- **Option A (preferred):** CSS-only phone frame (260×520px, dark border, rounded, inner screen shows simplified Rapidry app UI)
- **Option B:** Three.js phone model with scroll-triggered rotation (use only if stable)

**Right side:**
- "Get Rapidry on your phone" heading
- "Download now and get your first pickup free" subtext
- App Store + Play Store buttons (gold download icons)
- QR code placeholder (square with gold border)

---

### 5.10 Team Section (`sections/Team.jsx`)

**3 cards:**

| Person | Role | Bio | Tags |
|---|---|---|---|
| Nishant Sarawgi | Founder & CEO | "Started Rapidry after one too many ruined shirts and a broken promise of quality from local laundry options." | FOUNDER, GURGAON, EST. 2026 |
| Nayan Kumar | Technical Co-Founder | "Cybersecurity engineer and Big 4-trained consultant building the operating brain that keeps every order trackable and trusted." | BIG 4, CYBERSECURITY |
| You? | Open Position | "Looking for driven people who care deeply about building a new standard for personal care infrastructure in India." | HIRING, OPERATIONS, GROWTH |

> **IMPORTANT:** Do NOT use company names like "Ernst & Young", "EY", "NFSU", "Bosch". Use "Big 4" as a generic reference.

- Avatar circles with initials (NS, NK, X)
- LinkedIn icon links
- "View Openings" button on hiring card
- Hover: `translateY(-8px)`, gold border-top, subtle gradient sweep

---

### 5.11 Waitlist / First Order Offer (`sections/WaitlistOffer.jsx`)

- Background: forest-dark
- Offer pill: "🎁 FIRST ORDER OFFER"
- Headline: "Free first pickup for early members."
- Countdown: "50 SPOTS LEFT" (stored in localStorage, decrements visually)
- "0 people have already claimed this" social proof
- Form (React Hook Form + EmailJS):
  - Name (text input)
  - Phone (tel input)
  - Sector dropdown (Gurgaon sectors)
  - "CLAIM MY SPOT" gold button
- Success state: confetti animation + confirmation message
- EmailJS integration: sends to admin email, no backend needed

---

### 5.12 FAQ (`sections/FAQ.jsx`)

| Question | Answer |
|---|---|
| How does Rapidry work? | Book via app, we pick up, clean professionally, deliver in 3 hours. |
| What areas do you cover? | Gurgaon — Cyber City, DLF, Golf Course Road, Sectors 29, 44, 56, and expanding. |
| How is pricing calculated? | By weight (kg) for wash services, per item for dry clean, ironing, shoe/bag cleaning. |
| Is there a minimum order? | No minimum order. Book even 1 item. |
| What if my clothes are damaged? | Full insurance coverage. We guarantee quality or full refund. |
| Can I track my order? | Yes — real-time tracking in the app from pickup to delivery. |

- Accordion behavior: one open at a time
- Gold left-line draws when answer opens
- Chevron rotates 180° on toggle
- Framer Motion: `AnimatePresence` for smooth height transitions

---

### 5.13 Footer (`layout/Footer.jsx`)

**Multi-column layout:**
- Column 1: Rapidry logo + tagline + social icons (Instagram, Twitter, LinkedIn)
- Column 2: Quick Links (Services, How It Works, Coverage, Download)
- Column 3: Services list
- Column 4: Contact (WhatsApp, email, Gurgaon address)
- Bottom bar: "© 2026 Rapidry Pvt. Ltd." + Privacy + Terms
- Final CTA strip above footer: "Ready for fresh clothes?" + "Download Now" button

---

## 6. Global UX Requirements

### 6.1 Animations
- **Smooth scroll:** Lenis (lerp 0.08)
- **Section entrances:** GSAP ScrollTrigger, `once: true`, `start: 'top 82%'`
- **Headings:** cada word slides up from behind overflow mask
- **Cards:** stagger `y: 80 → 0`, `opacity: 0 → 1`, `duration: 0.8s`
- **Section transitions:** 100–120px gradient dividers between dark↔cream sections
- **Reduced motion:** Respect `prefers-reduced-motion: reduce` — disable all animations

### 6.2 Scroll Progress
- 3px gold bar at top of viewport
- Box-shadow glow: `0 0 10px rgba(214,185,123,0.5)`
- Small gold dot (8px) at leading edge

### 6.3 Custom Cursor
- **REMOVED** — use default browser cursor
- Premium sites (Linear, Apple) use default cursors

### 6.4 Responsive Breakpoints
| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Single column, no video bg (use poster), simplified animations |
| Tablet | 768–1024px | 2-column grids, scaled typography |
| Desktop | > 1024px | Full layout, all animations, video background |

### 6.5 Hover Effects (Apply to ALL interactive elements)
- **Buttons:** `translateY(-2px)` + shadow increase + 0.3s transition
- **Cards:** `translateY(-4px)` + shadow increase + border brightens
- **Links:** Gold underline draws from center outward
- **Pills/badges:** Background opacity increases

---

## 7. SEO & Performance

### 7.1 SEO
| Item | Specification |
|---|---|
| Title | "Rapidry — Premium Laundry Service in Gurgaon | 3-Hour Express Delivery" |
| Meta description | "Rapidry delivers fresh, professionally cleaned clothes to your door in as fast as 3 hours. Wash & fold, dry clean, ironing & more. Gurgaon's premium laundry service." |
| OG Image | Hero screenshot or branded card |
| Canonical URL | `https://rapidry.in` |
| Language | `en-IN` |
| robots.txt | Allow all |
| sitemap.xml | Single-page, reference `https://rapidry.in/` |
| Schema.org | LocalBusiness structured data (JSON-LD) |

### 7.2 Performance Targets
| Metric | Target |
|---|---|
| Lighthouse Performance | 85+ |
| Lighthouse SEO | 95+ |
| Lighthouse Accessibility | 90+ |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

### 7.3 Optimizations
- Lazy load all sections below the fold (`React.lazy` + `Suspense`)
- Code-split Three.js components
- Video: `preload="none"`, load on intersection
- Images: WebP format, responsive sizes
- Fonts: `display: swap`, preconnect Google Fonts
- Tree-shake unused Lucide icons

---

## 8. Content To Be Provided By Client

| Item | Status |
|---|---|
| Founder photo (Nishant Sarawgi) | ⬜ Pending — using initials (NS) |
| Nayan Kumar photo | ⬜ Pending — using initials (NK) |
| App Store / Play Store links | ⬜ Pending — using # placeholder |
| WhatsApp business number | ⬜ Pending — using generic wa.me link |
| Social media URLs (Instagram, Twitter, LinkedIn) | ⬜ Pending |
| EmailJS service ID, template ID, public key | ⬜ Pending — form won't send until configured |
| Privacy Policy page content | ⬜ Pending |
| Terms of Service page content | ⬜ Pending |
| Hero video (Cloudinary) | ✅ Uploaded: `download_fdstec.mp4` |
| Domain (rapidry.in) | ⬜ Pending registration |

---

## 9. Deployment

| Step | Detail |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist/` |
| Platform | Vercel (free tier) |
| Root directory | `rapidry-website/` (monorepo subfolder) |
| Environment variables | `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` |
| SSL | Automatic via Vercel |
| CDN | Vercel Edge Network (global) |

---

## 10. Timeline

| Phase | Days | Deliverables |
|---|---|---|
| Setup + Global Components | Day 1–2 | Project config, Navbar, Footer, Lenis, ScrollProgress |
| Hero + Stats | Day 3–4 | Hero with video, entrance animations, Stats Strip |
| Services + Calculator | Day 5–7 | 3D tilt cards, price calculator |
| How It Works + Coverage | Day 8–10 | Step guide, interactive map |
| Testimonials + Download | Day 11–13 | Marquee cards, phone mockup, store buttons |
| Team + Waitlist + FAQ | Day 14–16 | Team cards, form, accordion |
| SEO + Performance | Day 17–18 | Meta tags, code splitting, Lighthouse audit |
| Testing + Deployment | Day 19–21 | Cross-browser testing, Vercel deployment |

**Total: 21 working days**

---

## 11. Out of Scope

- ❌ User authentication / login
- ❌ Real order placement through the website
- ❌ Payment processing
- ❌ Admin panel / CMS for content management
- ❌ Blog / articles section
- ❌ Multi-language support
- ❌ Backend API for the marketing website
- ❌ Real-time chat support widget

---

## 12. Pricing

| Item | Amount |
|---|---|
| Full website design + development + deployment | ₹40,000 |
| Ongoing content updates (post-delivery) | ₹700/hour or ₹3,000/month retainer |
| CMS integration (future, if needed) | ₹15,000–20,000 add-on |
| Additional pages (blog, careers, etc.) | ₹5,000/page |

---

## Document History

| Version | Date | Changes |
|---|---|---|
| v1.0 | 22 March 2026 | Initial SRS |
| v2.0 | 22 March 2026 | Updated: 3-hr delivery (not 48), removed EY/NFSU/Bosch references, added Big 4, removed custom cursor, visible video bg (no green overlay), removed scroll-pinned hero, added 3D tilt cards spec, updated team bios, simplified How It Works layout |
