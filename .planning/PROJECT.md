# PNT Academy — Payment Page Redesign

## What This Is

A premium payment page for PNT Academy's brownfield Next.js website that allows the admin to generate shareable payment links with dynamic UPI QR codes, UPI app deep links, and bank transfer details. The page matches the existing glassmorphism + framer-motion design language.

## Core Value

**Enable clients to pay securely with a professional, branded experience** — dynamic amount QR codes + UPI app buttons — while giving the admin instant WhatsApp/email notification with UTR verification.

## Requirements

### Validated

- ✓ UPI QR code generation from admin-configured UPI ID — existing
- ✓ Bank transfer details display (Account Name, Bank, Account Number, IFSC) — existing
- ✓ Copy-to-clipboard for all payment fields — existing
- ✓ Admin settings stored in MongoDB (AdminSettings model) — existing
- ✓ Navbar + MobileBottomNav navigation includes Payments link — existing

### Active

- [ ] Dynamic amount-embedded UPI QR codes via URL query params (`?amount=5000`)
- [ ] UPI intent deep links (GPay, PhonePe, Paytm buttons) with amount pre-filled
- [ ] Shareable personalized URLs (`?amount=X&course=Y&name=Z`)
- [ ] Hero section with animated gradient text + enrollment process flow
- [ ] 3-step process cards (Contact → Personalized Plan → Secure Payment)
- [ ] "I've Paid" button with UTR input → WhatsApp notification to admin
- [ ] Glassmorphism + framer-motion animations matching Contact page
- [ ] Navbar + Footer integration (currently missing)
- [ ] Full dark/light mode support
- [ ] Mobile responsive layout

### Out of Scope

- Payment gateway integration (Razorpay/Stripe) — adds 2% fees, not needed for current flow
- Auto-detection of payment status — requires business UPI account/gateway
- Payment history tracking — admin verifies manually via bank statement + UTR

## Context

- This is a brownfield project (existing Next.js App Router website)
- Contact page (`ContactClient.tsx`) is the design reference — glassmorphism, framer-motion, gradient orbs
- Admin configures payment details via `/admin/settings`
- Current payment page lacks Navbar, Footer, and has simpler styling
- Stitch MCP design (Gemini 3 Pro) already generated — screen ID: `d1fe83eb84a24ba7a0d45a9ecddc3f70`

## Constraints

- **Tech Stack**: Next.js App Router, Tailwind CSS, framer-motion, lucide-react icons
- **Payment**: UPI only (Indian market), zero transaction fees required
- **Design**: Must match existing website glassmorphism design language
- **Data**: Payment details from MongoDB AdminSettings model (no new models needed)
- **Verification**: UTR-based manual verification (client shares, admin cross-checks bank statement)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| UPI intent buttons instead of payment gateway | Zero fees, matches Indian market, simpler integration | — Pending |
| UTR-based verification instead of auto-detection | Free, no gateway dependency, admin can verify in bank app | — Pending |
| URL query params for amount/course instead of DB | No new models needed, admin just shares a link | — Pending |
| Match Contact page design patterns | Consistency across website, all patterns already proven | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-03-23 after initialization*
