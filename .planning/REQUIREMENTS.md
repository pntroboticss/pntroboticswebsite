# Requirements — Payment Page Redesign

## Functional Requirements

### FR-1: Dynamic Amount QR Code
- Generate UPI QR code with amount embedded: `upi://pay?pa={upiId}&pn=PNT+Academy&am={amount}&cu=INR`
- Amount sourced from URL query param `?amount=5000`
- Fall back to amount-less QR when no amount specified
- Use `api.qrserver.com` (free, no API key needed)

### FR-2: UPI App Deep Links
- "Pay via GPay" button: `gpay://upi/pay?pa={upiId}&pn=PNT+Academy&am={amount}&cu=INR`
- "Pay via PhonePe" button: `phonepe://pay?pa={upiId}&pn=PNT+Academy&am={amount}&cu=INR`
- "Pay via Paytm" button: `paytmmp://pay?pa={upiId}&pn=PNT+Academy&am={amount}&cu=INR`
- Generic "Pay via UPI" button: `upi://pay?...` (opens default UPI app)
- Buttons visible on mobile, QR visible on desktop (responsive)

### FR-3: Shareable Personalized URLs
- URL format: `/payments?amount=5000&course=Robotics+Basic&name=Rahul`
- Display course name and amount prominently in hero
- Client name used in "I've Paid" WhatsApp message

### FR-4: Payment Verification (UTR-based)
- "I've Paid" button opens a small inline section asking for 12-digit UTR number
- On submit, opens WhatsApp with pre-filled message:
  `"Hi, I've completed payment of ₹{amount} for {course}. UTR: {utr}. Name: {name}"`
- Admin verifies UTR against bank statement

### FR-5: Bank Transfer Details
- Display Account Name, Bank Name, Account Number, IFSC Code
- Each field has copy-to-clipboard button
- Data from AdminSettings MongoDB model

## Design Requirements

### DR-1: Match Contact Page Design Language
- Glassmorphism: `bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl`
- Background gradient orbs (blue + purple, blurred)
- Framer-motion animations: `fadeUp`, `staggerContainer`, `AnimatedSection`
- Card hover effects: `cardHover` variant

### DR-2: Page Structure
- Include `Navbar` component (existing)
- Include `Footer` component (existing)
- Hero with sparkle badge + animated gradient text
- 3-step process flow cards
- Payment methods section (QR + Bank Transfer side by side)
- Trust/security badge
- Help CTA linking to `/contact`

### DR-3: Responsive
- Desktop: 2-column layout for payment cards
- Mobile: Single column, UPI app buttons instead of QR code
- Tablet: Flexible breakpoint at `md:` and `lg:`

### DR-4: Dark/Light Mode
- Full support using existing Tailwind dark: prefix
- Match existing site theme toggle behavior

## Acceptance Criteria

- [ ] `/payments` renders with Navbar and Footer
- [ ] `/payments?amount=5000&course=Robotics` shows ₹5,000 and "Robotics" in hero
- [ ] QR code includes amount when specified
- [ ] GPay/PhonePe/Paytm buttons generate correct intent URLs
- [ ] "I've Paid" button collects UTR and opens WhatsApp
- [ ] Copy buttons work for all fields
- [ ] Page looks identical in style to Contact page
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Dark and light mode both work correctly
