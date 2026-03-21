# Rapidry Design System Guidelines

## Core Principles
- Every screen is 390x844px (iPhone 14 Pro)
- Horizontal padding: always 20px (mobile), 24px (web)
- All card paddings: 16–20px inside
- Gap between cards: 10–14px
- All touch targets: minimum 44x44px

## Color Rules
- Gold (#D6B97B) is used ONLY for: primary CTAs, 
  prices, active state indicators, icons on dark cards.
  Never use gold as body text on cream backgrounds.
- Dark green (#0F2E2A) screens: Agent App, 
  Payment screen, Splash screen.
- Cream (#F3EFE6) screens: All Customer App screens 
  except Payment and Splash.

## Typography Rules
- Playfair Display: screen headings, brand name, 
  large price display, floating input labels.
- DM Sans: everything else — body, labels, 
  button text, captions, nav labels.
- Never use any other font.
- Font loading in React Native: use expo-font + 
  bundled .ttf files. Never Google Fonts URL.

## Component Rules
- Always use Button component — never raw <button> 
  for CTAs.
- Button height: 56px standard, pill radius (999px).
- Input: floating label pattern, bottom border only.
  Error state: red border + red message below field.
- Card: white bg + Elevation 2 shadow.
  Active = gold left border. Selected = gold full border.
  Disabled = 0.45 opacity.
- Bottom nav: shared BottomNavBar component on all 
  10 customer screens except: Splash, Login, OTP, 
  Payment, OrderConfirmed.

## Screen Background Rules
Dark (#0F2E2A): Splash, Payment, Agent Dashboard,
  Agent Task, Agent Verify, Agent Earnings, 
  Agent Profile.
Light (#F3EFE6): All other Customer App screens,
  Admin Dashboard, Partner Panel.

## Agent Assignment Flow
Admin Screen 17 (Orders) → Assign button on 
unassigned rows → AgentAssignmentDropdown → 
shows online agents only → select + confirm → 
row updates to show agent name + status changes.

## Empty State Rules
Always show EmptyState component, never blank screen.
Light variant on cream screens, dark variant on 
green screens.

## Navigation Rules
Bottom nav active indicator: 3px gold pill above icon.
Active icon: filled, #0F2E2A.
Inactive icon: outlined, #9CAB9A.
Web sidebar: 240px fixed width, always #0F2E2A.

## React Native Specific Notes
- backdropFilter (GlassCard) needs 
  @react-native-community/blur package.
- fontStyle: italic only works with italic .ttf loaded.
- No CSS variables in React Native — use the FONTS 
  and COLORS constants from src/app/constants/.
- All dimensions are in points (same as px on 1x).
- Safe area: use SafeAreaView at root, or add 
  paddingTop: 47 manually.
