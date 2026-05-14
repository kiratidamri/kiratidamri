# SafeTraX

Context-aware travel risk and health advisory for travelers.

## Features

1. **Register** — Name, DOB, address, phone, email, emergency contact, citizenship, height, weight, blood type, race, health concerns (10-item checklist), vaccination history, additional note, consent and digital signature.
2. **Travel plan (Itinerary)** — Multiple destinations (US states + international), dates, primary transportation, checklist (immigration, health, law, weather).
3. **Recommendation (Analysis)** — Overall and sub-region risk scores (0–10), map view, links to CDC/WHO/local government, checklist verification, follow-up services (vaccine, car, hospitals, drug stores), optional 2-hour notifications.
4. **Real-time dashboard** — Risk score, weather, concerns (food, water, air/noise pollution, unrest, disasters), editable info, share with family/friends/government.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (optional; map works without it as placeholder)
npm run dev
```



## Mobile app (PWA)

SafeTraX runs as a **Progressive Web App** so you can use it like a mobile app:

1. **On your phone:** Open the app in Chrome (Android) or Safari (iOS) and use **Add to Home Screen** / **Install app**.
2. **Standalone:** It opens in fullscreen without the browser UI (status bar uses theme color).
3. **Layout:** Bottom navigation bar and touch-friendly buttons (44px min) on small screens; desktop keeps the top nav.

Icons in `public/icons/` are placeholders (1×1 PNG). Replace `icon-192.png` and `icon-512.png` with real 192×192 and 512×512 PNGs for a proper home-screen icon.

## Risk score bands

- **0–3** Lower safe — must revise your plans  
- **4–6** Intermediate safe — be cautious  
- **7–9** Higher safe — must follow law and regulation  
- **10** Highest — no concerns  

## Tech

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- **PWA:** `manifest.json`, mobile viewport, safe-area insets for notched phones
- Data stored in `localStorage` (no backend required for demo)
- Google Maps: set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for full map integration
