Redesign the Rapidry home screen. Keep the brand colors 
(#0F2E2A forest green, #D6B97B gold, #F3EFE6 cream) but 
completely simplify the layout. The current design is 
cluttered — fix it with these exact rules:

CORE PRINCIPLE: One dominant visual element per section. 
Maximum 2 card styles in the entire screen. 
Every element must have a clear purpose.

BACKGROUND: #F3EFE6 cream. Single flat color. No texture.

━━━ HEADER (height 100px, 20px horizontal padding) ━━━

Left stack (vertical, gap 2px):
  Line 1: "Good morning," — DM Sans Regular 13px, #9CAB9A
  Line 2: "Nishant" — Playfair Display Bold 24px, #0F2E2A

Right row (gap 12px, vertically centered):
  Bell icon — 22px, #0F2E2A, simple outline
  Avatar circle — 36px diameter, 
    background #0F2E2A, 
    "N" Playfair Display Bold 16px #D6B97B centered

ROW below header (20px horizontal padding, margin-top 8px):
Location pill:
  Background #0F2E2A, radius 999px (pill shape)
  Padding 8px 14px, height 34px, display inline-flex
  Left: Pin icon 14px #D6B97B
  Text: "Sector 66, Gurgaon" DM Sans Medium 13px #F3EFE6
  Right: Chevron down 12px #D6B97B

━━━ HERO BANNER (margin-top 20px, 20px horizontal padding) ━━━

Single clean card. Width 100%. Height 160px. 
Radius 18px. Background #0F2E2A. Overflow hidden.
NO watermark. NO texture. Clean flat card.

Inside (20px padding):
  Top: "Same-day pickup available" pill
    Background rgba(214,185,123,0.15)
    Border 1px rgba(214,185,123,0.25)
    Text: DM Sans Medium 11px #D6B97B
    Padding 4px 10px, radius 999px

  Middle: "Fresh clothes,\ndelivered." 
    Playfair Display Bold 26px #FFFFFF
    Line height 1.15. Margin-top 10px.
    MAX 2 lines. Nothing else on left side.

  Bottom: "Book Now →" button
    Background #D6B97B, radius 999px
    Padding 8px 16px, height 34px
    DM Sans SemiBold 12px #0F2E2A
    Margin-top 12px. Inline (not full width).

Right side of card: NOTHING. 
Empty space. Let the text breathe.
DO NOT add collar watermark or any icon here.

━━━ SERVICES SECTION (margin-top 28px, 20px horizontal padding) ━━━

Section header row:
  Left: "Services" — Playfair Display SemiBold 18px #0F2E2A
  Right: "See all →" — DM Sans Medium 13px #D6B97B

USE THIS EXACT GRID — 2 ROWS ONLY:

ROW 1 (margin-top 14px): 
Two equal cards side by side. Gap 12px.
Each card: width exactly 50% minus 6px gap. Height 130px.
Radius 14px. Padding 16px.

CARD LEFT — "Wash & Fold":
  Background #0F2E2A (dark)
  Top: Washing machine icon — 26px, color #D6B97B
  Bottom section (position absolute, bottom 14px):
    "Wash & Fold" — DM Sans SemiBold 14px #FFFFFF
    "₹49 / kg" — DM Sans Regular 12px #D6B97B
  NO badge. NO extra text. Clean.

CARD RIGHT — "Wash & Iron":
  Background #FFFFFF (white). 
  Border 1px #EAE4D8.
  Shadow: 0px 2px 8px rgba(15,46,42,0.06)
  Top: Iron icon — 26px, color #0F2E2A
  Bottom section (position absolute, bottom 14px):
    "Wash & Iron" — DM Sans SemiBold 14px #0F2E2A
    "₹79 / kg" — DM Sans Regular 12px #D6B97B

ROW 2 (margin-top 12px):
Three equal cards in a row. Gap 10px.
Each: width exactly 33% minus gaps. Height 100px.
Radius 14px. Padding 12px.
All three cards: Background #FFFFFF, border 1px #EAE4D8.

Card structure (all 3 identical style):
  Top: Icon 22px #0F2E2A
  Bottom:
    Name: DM Sans SemiBold 12px #0F2E2A (1 line max)
    Price: DM Sans Regular 11px #D6B97B

Cards: 
  Left: Hanger icon — "Dry Clean" — "From ₹199"
  Center: Steam iron icon — "Steam Iron" — "₹29/item"
  Right: Shoe icon — "Shoe Care" — "₹149"

IMPORTANT RULE FOR ALL CARDS:
Every card has ONLY: icon + name + price. 
No descriptions. No badges (except one "Most popular" 
on Wash & Fold if needed — tiny pill, bottom of card).
No arrows. No hover states shown in static design.

━━━ THAT IS THE ENTIRE HOME SCREEN ━━━

Do not add anything below the service grid.
No "Active Order" strip in default state.
No promotional banners.
No second hero.

BOTTOM NAVIGATION (fixed, height 72px):
Background #FFFFFF. Top border 1px #F0EDE6.
5 tabs: Home | Services | Orders | Track | Profile

Active tab (Home):
  Icon: filled house icon, 22px, #0F2E2A
  Label: DM Sans SemiBold 11px #0F2E2A
  Indicator: 3px wide pill, background #D6B97B, 
    centered above icon, width 20px

Inactive tabs:
  Icon: outlined, 22px, #9CAB9A
  Label: DM Sans Regular 11px #9CAB9A

FINAL DESIGN RULES — ENFORCE THESE:
1. Maximum 2 font sizes per section (one heading, one body)
2. Maximum 2 background colors in card section (dark green + white)
3. Icons must all be same size within a row (26px in row 1, 22px in row 2)
4. All corner radius must be consistent — 14px for service cards, 
   18px for hero, 999px for pills only
5. No gradients anywhere
6. No shadows on the dark cards — shadow only on white cards
7. Minimum 16px padding inside every card — no cramped content
8. Gold (#D6B97B) used ONLY for: prices, CTAs, active states, 
   icons on dark cards — nowhere else