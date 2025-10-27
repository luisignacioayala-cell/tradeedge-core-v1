# TradeEdge Core v1 (Local Template)

A minimal, stable starting point for TradeEdge outside Base44.
- Light theme, high contrast
- Dashboard with live *demo* ticks (no refresh)
- Options page with demo "Run Scan Now" unusual flow
- Logs + Settings (toggle Demo Mode)

## How to run
1. Install Node.js 18+
2. Unzip this folder
3. In the folder, run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL shown in the terminal.

## Going live
- Add a real Polygon socket service in `src/services/marketLive.js`
- Replace the demo tick starter in `Dashboard.jsx` with the live starter
- Keep the store/API shape intact to avoid UI changes
