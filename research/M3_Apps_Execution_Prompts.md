# Rapidry M3 — Execution Prompts (Apps on Device)

> **Goal:** Customer App + Agent App working on real phone. Client places a test order, agent accepts it.
> **Copy-paste each prompt in order.** Wait for completion before moving to the next.

---

## 🔧 Pre-M3 Checklist

Before starting, verify these work:
```bash
# 1. Backend is running
cd /Volumes/Crucial/LaundryApp-Project/backend && npm run dev
# Should say: "Rapidry API running on port 3000"

# 2. Customer app starts
cd /Volumes/Crucial/LaundryApp-Project/customer-app && npx expo start
# Should show QR code — scan with Expo Go on your phone

# 3. Firebase Phone Auth env vars exist in customer-app
# Check if .env or app config has EXPO_PUBLIC_FIREBASE_* variables
```

> [!IMPORTANT]
> The **auth flow (PhoneLogin + OTP) is already fully wired** with Firebase! Both screens have working code that calls `signInWithPhoneNumber`, `confirmationResult.confirm()`, and `POST /auth/verify-token`. No need to touch auth screens.

---

# PART A — CUSTOMER APP (8 New Screens)

---

## PROMPT 1 — Pickup Scheduling Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

My existing code patterns:
- Screens are in src/screens/ as .tsx files, exported as named exports
- Navigation: createNativeStackNavigator in App.tsx — I need to add new screens there
- Design tokens: import { COLORS, FONTS, LAYOUT, RADIUS, SPACING, TYPOGRAPHY } from '../constants'
- UI components: import { Button, BodyM, Heading1, LabelL } from '../components/ui'
- SafeAreaView wraps all screens with edges={['top']}
- Back button: Feather icon "arrow-left" in a 44x44 Pressable
- Theme: cream background (COLORS.cream), forest dark text (COLORS.forestDark), gold accents (COLORS.gold)

Design reference file (Figma export):
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/PickupSchedulingScreen.tsx

Create src/screens/PickupSchedulingScreen.tsx with:

1. Header: "Schedule Pickup" with back arrow (same pattern as ServiceDetailScreen)

2. Calendar strip section:
   - Show next 7 days in horizontal scroll
   - Each day shows: day name (Mon, Tue...), date number, month abbreviation
   - Today highlighted differently
   - Selected day has gold background with cream text
   - Use actual Date objects, start from tomorrow

3. Time slot section:
   - Title: "Select Time Slot"
   - 6 selectable chips in 2 columns:
     • 7:00 AM – 9:00 AM
     • 9:00 AM – 11:00 AM
     • 11:00 AM – 1:00 PM
     • 2:00 PM – 4:00 PM
     • 4:00 PM – 6:00 PM
     • 6:00 PM – 8:00 PM
   - Selected slot: gold background, white text
   - Unselected: white background, forestDark border

4. Special instructions: 
   - TextInput multiline, placeholder "Any special instructions? (optional)"
   - White background, border, rounded corners

5. Bottom CTA:
   - "Continue" button (full width, Button component, variant="primary")
   - Disabled until both date and slot are selected
   - On press: navigate to 'CartReview' with params: { pickupDate, pickupSlot, specialInstructions }

6. Register in App.tsx:
   - Add to RootStackParamList: PickupScheduling: undefined
   - Add Stack.Screen for PickupScheduling
   - In ServiceDetailScreen, change handleViewCart to navigate to 'PickupScheduling' instead of showing Alert

Test: Run app, add items to cart, tap "View Cart" → should see scheduling screen.
```

---

## PROMPT 2 — Cart / Order Review Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/CartReviewScreen.tsx

Create src/screens/CartReviewScreen.tsx with:

1. Header: "Order Summary" with back arrow

2. Delivery address card:
   - Show the user's default address (or first address)
   - Fetch from GET /addresses using the api service (src/services/api.ts)
   - Show label (Home/Work), full_address, landmark
   - "Change" link/button on the right
   - If no address: show "Add an address" with a button

3. Pickup slot display:
   - Receive pickupDate, pickupSlot from route params
   - Format: "Monday, 25 Mar • 9:00 AM – 11:00 AM"

4. Items breakdown:
   - Read from useCartStore (items object)
   - For each cart line: show item name, quantity, unit price, total (qty × price)
   - Show item counts: "2x Shirt — ₹70"

5. Price summary:
   - Subtotal: sum of all item totals
   - Delivery fee: ₹30 (hardcoded)
   - Coupon input: TextInput + "Apply" button
     - On apply: POST /coupons/validate with { code, order_total: subtotal }
     - If valid: show discount amount in green, update total
     - If invalid: show error message in red
   - Discount line (shown only if coupon applied): "- ₹XX"
   - Total: Subtotal + 30 - discount

6. Bottom CTA:
   - "Proceed to Pay — ₹{total}" button
   - Navigate to 'Payment' with params: { addressId, pickupDate, pickupSlot, specialInstructions, couponCode, total }

7. Register in App.tsx:
   - Add CartReview to RootStackParamList with route params
   - Add Stack.Screen
   - Update PickupSchedulingScreen to navigate to 'CartReview'

Test: Full flow — Home → Service → add items → Schedule → Cart Review shows items and prices.
```

---

## PROMPT 3 — Payment Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/PaymentConfirmationScreen.tsx

Create src/screens/PaymentScreen.tsx with:

1. Header: "Payment" with back arrow

2. Payment methods as selectable cards:
   - UPI (icon: smartphone)
   - Credit/Debit Card (icon: credit-card)
   - Cash on Delivery (icon: dollar-sign)
   - Each card: white background, border, rounded corners
   - Selected: gold border (2px), checkmark icon
   - Default selected: COD (simplest for MVP)

3. Order total displayed prominently:
   - "Total Payable" label
   - "₹{total}" in large bold text

4. Security badge:
   - Lock icon + "100% Secure Payment" text
   - Small, muted, near bottom

5. Bottom CTA:
   - "Pay ₹{total}" button (primary)
   - On press:
     a. Call POST /orders to create the order (send: address_id, pickup_date, pickup_slot, special_instructions, payment_method, coupon_code, items from cart store)
     b. If payment_method is 'upi' or 'card':
        - Call POST /payments/create-order with the order_id
        - For now, just show an Alert "Razorpay integration coming soon" (MVP uses COD primarily)
     c. If payment_method is 'cod':
        - Order is created directly, navigate to 'OrderConfirmed' with { orderId, orderNumber }
     d. Clear the cart store after successful order
   - Show loading state while creating order

6. Register in App.tsx
   - Add Payment to RootStackParamList
   - Add Stack.Screen

Test: Full flow — select COD → tap Pay → order gets created via API → see console log of created order.
```

---

## PROMPT 4 — Order Confirmed Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/OrderConfirmedScreen.tsx

Create src/screens/OrderConfirmedScreen.tsx with:

1. Full screen centered content (no header, no back button)

2. Success animation area:
   - Large green checkmark icon (Feather "check-circle", size 80, color COLORS.statusSuccess or green)
   - Animated: scale from 0 to 1 with spring effect using Animated API

3. "Order Placed!" heading (Heading1, centered)

4. Order number: "RD-XXXX" displayed below (from route params)

5. Info text: "Your pickup is scheduled. We'll notify you when an agent is on the way."

6. Two buttons:
   - "Track Order" → navigate to 'OrderTracking' with { orderId }
   - "Back to Home" → navigation.reset to Home (so back button goes to Home, not payment)

7. Register in App.tsx
   - Add OrderConfirmed to RootStackParamList with { orderId: string, orderNumber: string }
   - Add Stack.Screen

Test: Place an order via COD → should see this screen with the order number.
```

---

## PROMPT 5 — Order Tracking Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/OrderTrackingScreen.tsx

Create src/screens/OrderTrackingScreen.tsx with:

1. Header: "Order #RD-XXXX" with back arrow

2. Fetch order details: GET /orders/{orderId} using api service
   - Show loading skeleton while fetching

3. Status timeline (vertical stepper):
   - Steps: Placed → Agent Assigned → Picked Up → Processing → Ready → Out for Delivery → Delivered
   - Each step shows:
     - Circle icon: green filled (✓) for completed, gold pulsing for current, gray for pending
     - Status label
     - Timestamp (if available from order data)
   - Use a vertical line connecting the circles
   - Current status determined from order.status

4. Estimated delivery section:
   - "Estimated delivery: Tomorrow by 6 PM" (hardcoded for MVP)

5. Agent info card (if agent assigned):
   - For now: just show "Agent will be assigned shortly" placeholder
   - (Full agent info comes in M4 when admin assigns agents)

6. "Need Help?" link at bottom

7. Register in App.tsx
   - Add OrderTracking to RootStackParamList with { orderId: string }
   - Add Stack.Screen

Test: Place order → tap "Track Order" → see timeline with "Placed" status highlighted.
```

---

## PROMPT 6 — Order History Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Create src/screens/OrderHistoryScreen.tsx with:

1. Header: "My Orders"

2. Fetch orders: GET /orders using api service
   - Show loading skeleton while fetching

3. Two tabs: "Active" and "Past"
   - Active: orders with status NOT in ['delivered', 'cancelled']
   - Past: orders with status IN ['delivered', 'cancelled']
   - Tab bar: forest dark active tab with underline, gray inactive

4. Order cards (FlatList for performance):
   - Order number: "RD-XXXX"
   - Status badge (use StatusBadge component from src/components/ui/StatusBadge.tsx)
   - Item count: "3 items"
   - Total: "₹250"
   - Date: formatted created_at
   - On press: navigate to 'OrderTracking' with orderId
   - Past orders: show "Reorder" button (for now just Alert "Coming soon")

5. Empty state:
   - If no orders: show illustration/icon + "No orders yet" + "Browse services" button → navigate Home

6. BottomNavBar with activeTab="Orders"

7. Register in App.tsx
   - Add OrderHistory to RootStackParamList
   - Add Stack.Screen

8. Update BottomNavBar component:
   - The "Orders" tab should navigate to 'OrderHistory' screen
   - Import navigation and use navigation.navigate('OrderHistory')

Test: Place a few orders → go to Orders tab → see them listed with correct status badges.
```

---

## PROMPT 7 — Account / Profile Screen

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AccountScreen.tsx

Create src/screens/AccountScreen.tsx with:

1. Header: "Profile"

2. Profile section:
   - Avatar circle with user initial (same as HomeScreen avatar style)
   - User name (from authStore user.name, or "Set Name" if null)
   - Phone number (from authStore user.phone)
   - Tappable name field: opens inline TextInput for editing
     - On blur/submit: PATCH /auth/me with { name: newName }

3. Saved addresses section:
   - Title: "Saved Addresses"
   - Fetch GET /addresses
   - List each address: icon (home/briefcase), label, full_address, landmark
   - Default badge on default address
   - "Add Address" button (for now just Alert — full address management in next prompt)

4. App settings section:
   - "Notifications" toggle (visual only for MVP)
   - "About" → show app version
   - "Help & Support" → Alert "Contact: support@rapidry.in"

5. Logout button:
   - Red tinted, at the bottom
   - On press: confirmation Alert → clearAuth() from authStore → navigation.reset to Splash

6. BottomNavBar with activeTab="Profile"

7. Register in App.tsx
   - Add Account to RootStackParamList
   - Add Stack.Screen

8. Update BottomNavBar:
   - "Profile" tab navigates to 'Account'

Test: Open Profile tab → see name + phone → edit name → see it update → logout → goes to Splash.
```

---

## PROMPT 8 — Address Management + Navigation Polish

```
I'm building the Rapidry customer app at:
/Volumes/Crucial/LaundryApp-Project/customer-app/

Create src/screens/AddressScreen.tsx with:

1. Header: "Manage Addresses" with back arrow

2. Address list:
   - Fetch GET /addresses
   - Each address card:
     - Icon based on label (home → home icon, work → briefcase, other → map-pin)
     - Label, full_address, landmark
     - Default badge
     - "Set as Default" button (if not default): PATCH /addresses/:id/default
     - "Edit" button: opens edit mode
     - "Delete" button: DELETE /addresses/:id with confirmation Alert

3. Add new address form (inline or modal):
   - Label selector: Home / Work / Other (3 chips)
   - Full address: TextInput (required)
   - Landmark: TextInput (optional)
   - "Use Current Location" button:
     - Uses expo-location: Location.requestForegroundPermissionsAsync()
     - Then Location.getCurrentPositionAsync()
     - Save lat/lng
   - "Save Address" button: POST /addresses

4. Register in App.tsx
   - Add AddressScreen to RootStackParamList
   - Add Stack.Screen

5. Connect from:
   - AccountScreen "Saved Addresses" section → navigate to AddressScreen
   - CartReviewScreen "Change" button on address card → navigate to AddressScreen

6. Final navigation cleanup — make sure ALL BottomNavBar tabs work:
   - Home → HomeScreen
   - Orders → OrderHistoryScreen
   - Notifications → Alert "Coming soon" (for now)
   - Profile → AccountScreen

Test: Full flow — Profile → Manage Addresses → add address with GPS → go back → 
      place order → CartReview shows the address.
```

---

# PART B — AGENT APP (6 Screens from Scratch)

---

## PROMPT 9 — Agent App Scaffold + Login Screen

```
I'm building the Rapidry AGENT app at:
/Volumes/Crucial/LaundryApp-Project/agent-app/

Current state: Only has src/constants/ (colors, spacing, typography). No screens, no navigation, no services.

The agent app has a DARK THEME:
- Background: dark forest (#0F2E2A or similar dark)
- Cards: slightly lighter dark
- Accent: gold (same as customer app COLORS.gold)
- Text: cream/white

Check the existing agent-app/src/constants/ for the actual color values.
Check agent-app/package.json for installed dependencies.

Set up the complete agent app scaffold:

1. agent-app/App.tsx (create/replace):
   - Same pattern as customer-app/App.tsx
   - createNativeStackNavigator with these screens:
     - AgentLogin
     - AgentDashboard
     - AgentTaskDetail
     - AgentVerifyItems
     - AgentEarnings
     - AgentProfile
   - Auth check: use a new agent auth store
   - Initial route: AgentLogin if not authenticated, AgentDashboard if authenticated

2. agent-app/src/services/api.ts:
   - Same pattern as customer-app's api.ts
   - Base URL: same backend, different API prefix for agent routes (/api/v1/agent)
   - Auto-inject JWT from agent auth store

3. agent-app/src/store/authStore.ts:
   - Same pattern as customer-app's authStore
   - Uses SecureStore with key 'rapidry_agent_jwt'
   - checkAuth calls GET /auth/me

4. agent-app/src/screens/AgentLoginScreen.tsx:
   - Simple phone + password login (for MVP, agents are created by admin)
   - Fields: phone number, password (for now just use phone as identifier)
   - For MVP: just call POST /auth/verify-token with a test token approach
   - OR simpler: hardcode a JWT for testing (generate one for the test agent user)
   - Show "Agent Login" heading, dark theme
   - Login button with gold accent

5. Agent-specific UI components:
   - agent-app/src/components/ui/Button.tsx — dark theme button (gold background, dark text)
   - agent-app/src/components/ui/Typography.tsx — same as customer but cream/white colors

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentDashboard.tsx

Test: Run `npx expo start` in agent-app folder → should see login screen on phone.
```

---

## PROMPT 10 — Agent Dashboard Screen

```
I'm building the Rapidry AGENT app at:
/Volumes/Crucial/LaundryApp-Project/agent-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentDashboard.tsx

Create src/screens/AgentDashboardScreen.tsx with:

1. Top section:
   - Agent name (from auth store)
   - Online/Offline toggle switch
     - When toggled: PATCH /agent/availability with { is_online: true/false }
     - Green dot when online

2. Today's stats row (3 stat cards):
   - Deliveries today (from GET /agent/earnings?period=today)
   - Earnings today: "₹XXX"
   - Rating: "4.9 ⭐"

3. Active orders section:
   - Fetch GET /agent/orders
   - If orders exist: show order cards
   - Each card shows:
     - Order number
     - Customer name (if available)
     - Pickup address (truncated)
     - Item count
     - Status badge
     - "View Details" button → navigate to AgentTaskDetail
   - If no orders: "No active orders. Go online to receive orders!"

4. Use dark theme throughout:
   - Dark background
   - Cards with slightly lighter background
   - Gold accents for important elements
   - White/cream text

Test: Log in as test agent → see dashboard → toggle online/offline → check API calls in backend console.
```

---

## PROMPT 11 — Agent Task Detail Screen

```
I'm building the Rapidry AGENT app at:
/Volumes/Crucial/LaundryApp-Project/agent-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentTaskDetailScreen.tsx

Create src/screens/AgentTaskDetailScreen.tsx with:

1. Header: "Pickup from {customer_name}" with back arrow

2. Map placeholder:
   - Gray rectangle with map pin icon and address text
   - (Real Google Maps integration deferred — for now just show the address prominently)
   - Show customer's address in large text
   - Distance: "N/A" (placeholder)

3. Customer info:
   - Phone: tap to call (Linking.openURL('tel:+91XXXXXXXXXX'))

4. Action buttons based on delivery status:
   - If status 'assigned': "Accept Pickup" button (gold)
     → PATCH /agent/orders/:id/accept
   - If status 'accepted': "Arrived at Location" button
     → PATCH /agent/orders/:id/status with { status: 'arrived' }
   - If status 'arrived': "Verify Items" button
     → Navigate to AgentVerifyItems screen
   - If completed: show "Completed ✓" badge

5. Order summary:
   - Item count from order
   - Order total

Test: Dashboard → tap order → see task detail → accept → status changes → "Arrived" button appears.
```

---

## PROMPT 12 — Agent Item Verification Screen

```
I'm building the Rapidry AGENT app at:
/Volumes/Crucial/LaundryApp-Project/agent-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentVerifyItemsScreen.tsx

Create src/screens/AgentVerifyItemsScreen.tsx with:

1. Header: "Verify Items" with back arrow

2. Customer info: name at top

3. Item checklist:
   - List items from the order
   - Each item row: name + quantity + counter (+/-)
   - Agent can adjust count if actual items differ from order
   - Visual: checkmark when count matches order

4. Photo section:
   - "Add Photo" button with camera icon
   - Uses expo-image-picker: launchCameraAsync()
   - Show photo thumbnail if taken
   - For MVP: just store locally (don't upload)

5. Item total at bottom: "Total: X items"

6. "Confirm Pickup" button (gold, full width):
   - Calls POST /agent/orders/:deliveryId/verify-items with verified item data
   - Then calls PATCH /agent/orders/:deliveryId/status with { status: 'completed' }
   - Navigate back to Dashboard
   - Show success toast/Alert

Test: Task Detail → "Verify Items" → see checklist → adjust counts → take photo → confirm → back to dashboard.
```

---

## PROMPT 13 — Agent Earnings Screen

```
I'm building the Rapidry AGENT app at:
/Volumes/Crucial/LaundryApp-Project/agent-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentEarningsScreen.tsx

Create src/screens/AgentEarningsScreen.tsx with:

1. Header: "My Earnings"

2. Period toggle: Today | This Week | This Month
   - Three horizontal chips, selected = gold background
   - On tap: GET /agent/earnings?period={today|week|month}

3. Big earning number:
   - "₹3,450" (large, bold, gold color)
   - "{X} deliveries" subtitle

4. Breakdown list:
   - Show daily breakdown (from API response)
   - Each row: Day name, earning amount, delivery count
   - Example: "Mon — ₹680 (8 deliveries)"

5. Payout info card:
   - "Next payout: ₹X,XXX on Friday"
   - Muted info text, card style

6. Navigation from Dashboard:
   - Add a bottom nav bar or menu button that goes to Earnings
   - Or add it as a tab if using bottom tabs

Test: Dashboard → Earnings → toggle periods → see different data.
```

---

## PROMPT 14 — Agent Profile Screen + Final Polish

```
I'm building the Rapidry AGENT app at:
/Volumes/Crucial/LaundryApp-Project/agent-app/

Design reference:
/Volumes/Crucial/LaundryApp-Project/design-reference/src/app/components/rapidry/AgentProfileScreen.tsx

Create src/screens/AgentProfileScreen.tsx with:

1. Profile header:
   - Large avatar circle with initial
   - Name + phone
   - Rating: "4.9 ⭐ (142 reviews)"

2. Stats row:
   - Total deliveries
   - Member since date
   - (Data from GET /auth/me or agent profile)

3. Documents section:
   - Aadhaar: ✅ Verified / ❌ Pending
   - DL: ✅ Verified / ❌ Pending
   - (Visual only for MVP — no upload)

4. Settings:
   - Notification preferences (toggle, visual only)
   - Help & Support → Alert
   - Logout → clear auth, go to AgentLogin

5. Add bottom navigation to agent app:
   - 4 tabs: Dashboard, Earnings, Profile
   - Or a simple bottom bar with 3 icons
   - Create agent-app/src/components/shared/AgentBottomNav.tsx

6. Final polish for agent app:
   - Make sure all screens navigate correctly
   - All API calls use the agent auth token
   - Dark theme is consistent across all screens
   - Loading states and error handling

Test the FULL AGENT FLOW:
1. Open agent app → login
2. Dashboard → toggle online
3. See assigned order → tap → accept
4. "Arrived" → verify items → confirm pickup
5. Check earnings
6. Check profile → logout
```

---

## ✅ M3 Done When:

After running all 14 prompts:
- [ ] Customer app: Login with OTP → browse services → add items → schedule pickup → review cart → apply coupon → pay (COD) → see order confirmed → track order → order history
- [ ] Agent app: Login → go online → see orders → accept → navigate → verify items → confirm pickup → check earnings → profile → logout
- [ ] Both apps run on real phone via Expo Go
- [ ] Both connect to backend APIs with real data
- [ ] Build APKs: `npx expo build:android` or `eas build --platform android`
- [ ] Install APKs on client's phone for demo

---

## 📌 Tips

1. **Run one prompt at a time** — test on phone before moving to next
2. **Keep backend running** while building screens (`npm run dev` in backend folder)
3. **Use Expo Go** on your phone to see changes live
4. **If a screen doesn't connect to API** — check backend console for error logs
5. **If auth fails** — the JWT may have expired. Log out and log in again
6. **Each prompt takes 15-30 minutes** — the whole M3 phase should take **3-5 days**
