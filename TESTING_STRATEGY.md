# PNT Academy Testing Strategy & Phases

To ensure a highly stable, premium user experience, testing must be integrated into our daily Git workflow. We are implementing **Playwright** for Automated End-to-End (E2E) testing, running alongside manual verification checklists for things automation cannot easily catch (like 3D WebGL performance or nuanced UI animations).

## Automated Testing Phases (Playwright)

We will roll out automated tests in phases as new features are built.

### Phase 1: Core Routing & Smoke Tests (Current)
- **Goal:** Ensure the app compiles and all core routes are accessible without 500/404 errors.
- **Tests:**
  - Verify Homepage loads.
  - Verify Desktop Navbar and Mobile Bottom Dial navigate to correct URLs.
  - Verify `<canvas>` elements load without crashing the DOM.

### Phase 2: Interactive Components & OS
- **Goal:** Test state changes and interactive UI.
- **Tests:**
  - Open PNT OS, trigger an app, and verify the Iframe or secure launch screen appears.
  - Click on the Robot and ensure the tooltip registers the click.
  - Verify the RoboMatchGame win state properly displays the coupon.

### Phase 3: CI/CD Pipeline
- **Goal:** Run these tests automatically before every deployment.
- **Tests:**
  - Set up GitHub Actions to run `npx playwright test` on every PR or push to `main`.

---

## Manual Testing Checklist (Daily Run)

Automated tests are great, but human eyes are required for 3D rendering and premium animations. Run this checklist locally or on your phone before major pushes:

### 1. 3D & WebGL Performance
- [ ] **Desktop:** Does the `RobotExpressive` model load smoothly? Does clicking the OS terminal trigger the zoom animation without extreme frame drops?
- [ ] **Mobile:** Is the 3D disabled or optimized? Does the page feel lightweight without heating up the phone?

### 2. UI / UX Animations
- [ ] **Mobile Dial Nav:** Swipe the dial. Do the icons scale and glow perfectly? Does it auto-navigate instantly when the swipe stops?
- [ ] **Dark/Light Mode:** Toggle the theme. Do all gradients, borders, and text contrasts remain highly readable?

### 3. Progressive Web App (PWA)
- [ ] **Installability:** Open Safari/Chrome on a real phone. Does "Add to Home Screen" work? 
- [ ] **App Feel:** When opened from the home screen, is the browser URL bar gone? Does the app feel like a native Amazon/Uber app?

### 4. Edge Cases
- [ ] **OS External Apps:** Open Tinkercad. Does the fallback screen appear asking to launch in a new window instead of a broken Refused to Connect iframe?
- [ ] **Clipboard API:** Trigger the RoboMatchGame win state on an insecure local network IP. Does it gracefully fallback instead of crashing?
