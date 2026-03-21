Design the main home screen for Rapidry premium laundry app.
Frame: 390 × 844px. This is the most critical screen — 
it must feel like a luxury service app, not a food delivery clone.
Use BENTO GRID layout for service cards — 2026's signature layout.

BACKGROUND: #F3EFE6 cream.

━━━ STICKY HEADER (height 108px including status bar) ━━━
Background: #F3EFE6 cream. 
Bottom border: none — seamlessly blends with content.

Row 1 (status bar area): Standard iOS status bar, dark icons.

Row 2 (padding 16px horizontal):
Left side:
  "Good morning," — DM Sans Regular 13px, #4A5568.
  "Nishant" — Playfair Display SemiBold 20px, #0F2E2A.
  (Stack vertically, tight gap 2px)
  
Right side: 
  Notification bell icon — 24px, #0F2E2A. 
  Badge dot in #D6B97B if unread.
  8px gap.
  Avatar circle: 36×36px, border 2px #D6B97B gold.

Row 3 (margin-top 10px, padding 16px horizontal):
Address selector pill:
  Background: #0F2E2A. Radius: pill. 
  Padding: 10px 16px. Height: 36px.
  Left: Location pin icon 14px #D6B97B.
  Center: "Sector 66, Gurgaon" — DM Sans Medium 13px, #F3EFE6.
  Right: Chevron down 14px #D6B97B.
  Max-width: 220px (truncate if longer).

━━━ SCROLLABLE CONTENT (starts below header) ━━━

SECTION 1 — HERO BANNER (24px margin-top, 16px horizontal padding):
Card: Width 358px. Height 180px. Radius 20px. Overflow hidden.
Background: #0F2E2A forest green.
Right 40% of card: Subtle fabric weave texture at 8% opacity (cream).

Inside card (24px padding):
Top badge: Pill background rgba(214,185,123,0.15), 
  border 1px rgba(214,185,123,0.30),
  "✦ Same-day pickup available" — DM Sans Medium 11px, #D6B97B.
  Radius pill, padding 4px 10px.

Heading (margin-top 10px): 
  "Fresh clothes,\ndelivered." — 
  Playfair Display Bold 26px, #F3EFE6, line-height 1.2.
  
Subtext (margin-top 6px):
  "Schedule a pickup in 60 seconds" — 
  DM Sans Regular 13px, #F3EFE6 at 70% opacity.

CTA pill (margin-top 16px): 
  "Book Now" — fill #D6B97B, text #0F2E2A, 
  DM Sans SemiBold 12px, padding 8px 18px, radius pill.

Right side of banner (absolute positioned):
  Collar icon illustration, cream, large (120px) at 10% opacity — 
  decorative background watermark at top-right.

SECTION 2 — BENTO SERVICES GRID (margin-top 28px, 16px horizontal padding):

Section label (margin-bottom 16px):
  "Our Services" — DM Sans SemiBold 13px, #4A5568, letter-spacing 0.5px, uppercase.
  Right: "See all →" — DM Sans Medium 12px, #D6B97B.

BENTO GRID LAYOUT (inspired by Apple's bento grid, 2026 trend):
Total width: 358px. Gap: 12px.

ROW A: Two cards side by side (equal width ~173px each)
  Card A1 — WASH & FOLD (tall — height 160px):
    Background: #0F2E2A. Radius 16px. Padding 16px.
    Top: Service icon (minimalist washing machine outline, 28px, #D6B97B).
    Bottom section:
    Service name: "Wash & Fold" — Playfair Display SemiBold 16px, #F3EFE6.
    Price: "₹49 / kg" — DM Sans Medium 13px, #D6B97B.
    Small tag: "Most popular" — 
    background rgba(214,185,123,0.15), text #D6B97B, DM Sans 10px, radius pill.

  Card A2 — WASH & IRON (tall — height 160px):
    Background: #F3EFE6. Border 1.5px #D6B97B. Radius 16px. Padding 16px.
    Top: Iron icon, 28px, #0F2E2A.
    Bottom:
    Service name: Playfair Display SemiBold 16px, #0F2E2A.
    Price: DM Sans Medium 13px, #D6B97B.

ROW B: One wide card full width
  Card B — DRY CLEAN (wide — height 100px):
    Background: linear-gradient from #183F3A to #0F2E2A. 
    Radius 16px. Padding 16px 20px.
    Layout: Horizontal — icon left, text center, price + arrow right.
    Icon: Hanger outline, 32px, #D6B97B.
    Name: "Dry Clean" Playfair Display SemiBold 17px #F3EFE6.
    Sub: "From ₹199" DM Sans Medium 13px #D6B97B.
    Right: "→" chevron in gold circle 28px.

ROW C: Three small cards equal width (~109px each, height 110px):
  Card C1 — STEAM IRON:
    Background: white. Radius 16px. Shadow Elevation/2. Padding 12px.
    Icon: Steam iron, 24px, #0F2E2A.
    Name: DM Sans SemiBold 12px #0F2E2A, 2 lines max.
    Price: DM Sans Regular 11px #D6B97B.

  Card C2 — SHOE CLEAN:
    Background: white. Same style.
    Icon: Shoe outline, 24px.

  Card C3 — BAG CARE:
    Background: white. Same style.
    Icon: Bag outline, 24px.

SECTION 3 — ACTIVE ORDER STRIP (margin-top 28px, show if order exists):
  Full width minus 32px. Height 72px. Radius 14px.
  Background: Glass/Dark (rgba(15,46,42,0.88)), backdrop blur 16px.
  Left: Circular progress ring (gold, 40px), 
        percentage inside, DM Sans Bold 13px, #D6B97B.
  Center:
    "Order in progress" — DM Sans SemiBold 14px, #F3EFE6.
    "Processing · Est. delivery Tue 10AM" — DM Sans Regular 12px, #9CAB9A.
  Right: "Track →" — DM Sans SemiBold 12px, #D6B97B.

━━━ BOTTOM NAVIGATION BAR ━━━
Background: white. Height 83px (includes home indicator area).
Top border: 0.5px #E8E4DC.
5 tabs: Home (active) | Services | Orders | Track | Profile.
Active: Icon filled #0F2E2A + label DM Sans SemiBold 11px #0F2E2A.
Active indicator: 3px rounded line above icon in #D6B97B.
Inactive: Icon outlined #9CAB9A + label DM Sans Regular 11px #9CAB9A.