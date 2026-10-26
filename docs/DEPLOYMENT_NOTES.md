# Himanvic Portfolio — Deployment Notes

This document provides deployment guidelines and architecture details for the **Himanvic** personal developer portfolio website.

---

## Structure Overview

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **3D Graphics:** React Three Fiber / Drei (@react-three/fiber, @react-three/drei, three, maath)
- **Repository:** [https://github.com/himanvic/himanvic-portfolio](https://github.com/himanvic/himanvic-portfolio)

---

## Deployment Platforms

### Cloudflare Pages (Recommended)
1. In Cloudflare Dashboard, navigate to **Compute (Workers & Pages) > Create > Pages > Connect to Git**.
2. Connect the `himanvic-portfolio` repository.
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`
4. Click **Save and Deploy**.

### Vercel
1. Import repository `himanvic-portfolio`.
2. Framework preset will automatically detect **Vite**.
3. Build command: `npm run build`, output: `dist`.
4. Deploy.

---

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
