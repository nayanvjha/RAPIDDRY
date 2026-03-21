Create a new file:
src/app/components/rapidry/AgentProfileScreen.tsx

FRAME: 390 x 844px
BACKGROUND: #0F2E2A dark green (matches all agent screens)

STATUS BAR: 47px spacer

HEADER (padding 16px horizontal):
  "My Profile" 
  Playfair Display SemiBold 20px #F3EFE6 centered

PROFILE HERO (margin-top 24px, centered):
  Avatar circle: 72px diameter
    Background: #183F3A
    Border: 2px solid #D6B97B (gold ring)
    Initials "RP" — Playfair Display Bold 26px #D6B97B 
    centered
  
  Agent name (margin-top 12px):
    "Ravi Prasad"
    Playfair Display SemiBold 22px #F3EFE6 centered
  
  Role label:
    "Delivery Agent · Rapidry"
    DM Sans Regular 13px #9CAB9A centered
  
  Rating row (margin-top 8px, centered, gap 4px):
    3 gold star icons (14px each, filled #D6B97B)
    "4.8" DM Sans SemiBold 14px #D6B97B
    "(127 deliveries)" DM Sans Regular 12px #9CAB9A

STATS ROW (margin-top 24px, 16px horizontal padding, 
gap 10px, flex row):
  3 equal stat cards:
    Background: #183F3A
    Border-radius: 14px
    Padding: 14px 12px
    Value: Playfair Display Bold 22px #F3EFE6 centered
    Label: DM Sans Regular 11px #9CAB9A centered

  Card 1: "48" / "This Month"
  Card 2: "Rs.3,840" / "Earnings"
  Card 3: "4.8" / "Rating"

KYC STATUS CARD (margin-top 16px, 16px horizontal 
padding):
  Background: #183F3A
  Border-radius: 14px
  Padding: 14px 18px
  Left: green checkmark circle 20px (#15803D fill, 
        white check icon)
  Text: "Identity Verified" DM Sans SemiBold 14px #F3EFE6
  Sub: "Aadhaar + Driving Licence verified" 
       DM Sans Regular 12px #9CAB9A
  Right: "VERIFIED" pill — 
         background rgba(21,128,61,0.15), 
         text #15803D, DM Sans Bold 10px

SETTINGS MENU (margin-top 20px, 16px horizontal padding):
  Single white-background list card
  Border-radius: 16px
  Background: #183F3A

  Menu items (each 52px tall, padding 0 18px):
  Separator: 0.5px #0F2E2A between items

  Items:
  1. Vehicle icon + "Vehicle Details" + chevron right
  2. Bank icon + "Bank Account" + chevron right  
  3. Bell icon + "Notifications" + chevron right
  4. Help icon + "Help & Support" + chevron right
  5. Info icon + "App Version 1.0.0" + no chevron, 
     version number right-aligned in #9CAB9A

  Last item (Sign Out) — separated by 8px gap:
  Separate card, same style but:
  Exit/logout icon RED (#991B1B)
  "Sign Out" DM Sans SemiBold 15px #991B1B
  No chevron

  All icons: 20px, outlined style, color #D6B97B
  All labels: DM Sans Regular 15px #F3EFE6
  All chevrons: 16px #9CAB9A

BOTTOM: Agent bottom navigation bar, same dark theme.
Active tab: "profile" (the person icon, gold).
Other 3 tabs: Tasks, Map, Earnings (outlined, muted).

PROPS:
  agentName?: string
  rating?: number
  totalDeliveries?: number
  monthlyTasks?: number
  monthlyEarnings?: number
  isVerified?: boolean
  onVehicleDetails?: () => void
  onBankAccount?: () => void
  onNotifications?: () => void
  onHelp?: () => void
  onSignOut?: () => void

After creating the file, add it to App.tsx:
  Import it
  Add 'agentprofile' to the activeTab union type
  Add a nav tab for it
  Add the render block with the component