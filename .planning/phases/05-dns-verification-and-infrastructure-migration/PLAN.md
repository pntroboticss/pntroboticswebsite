# Phase 5: DNS Verification and Infrastructure Migration

## Objective
Migrate all services from personal accounts to the official PNT Academy company accounts.

## ✅ Completed Today (Apr 9, 2026)
- [x] **GitHub Organization created:** `github.com/pntacademy`
- [x] **Domain verified on GitHub:** TXT record `_gh-pntacademy-o` added & verified ✅
- [x] **Repository transferred:** `pntacademy/PNT-Academy-Website` (private)
- [x] **Premium Organization README created:** `.github/profile/README.md` with animated banner
- [x] **Premium Repo README updated:** Full project documentation with tech stack
- [x] **Local git remote updated:** VS Code now pushes to `pntacademy` org
- [x] **Sentry integrated:** DSN + Auth Token added to `.env.local`
- [x] **New Vercel account created:** Connected to `pntacademy` GitHub org
- [x] **New deployment live:** `https://pnt-academy-website.vercel.app/` ✅
- [x] **All env vars copied:** Firebase, MongoDB, Resend, Sentry, Gemini, Groq
- [x] **`RESEND_FROM_EMAIL` fixed:** Now set to `pnt-trainings@pntacademy.com`

## ⏳ Pending Tomorrow (Need DNS Access)
- [ ] **Add 2 Vercel TXT records in DNS provider** to verify domain ownership:
  - `_vercel` → `vc-domain-verify=pntacademy.com,e88ad53893f04150796f`
  - `_vercel` → `vc-domain-verify=www.pntacademy.com,0d55bea85b8a446659d7`
- [ ] Click **"Refresh"** on both domains in new Vercel → Settings → Domains
- [ ] Confirm `pntacademy.com` routes to new Vercel deployment
- [ ] Delete old personal Vercel project (after domain confirmed working)

## 🔜 Still To Do (Future Phases)
- [ ] Transfer Resend account to company email
- [ ] Transfer MongoDB Atlas to company email
- [ ] Transfer Sentry to company email

