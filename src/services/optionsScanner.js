// Minimal demo unusual options scanner + basic exposure stats (safe for all browsers)
import { appStore } from "../stores/useAppStore.js";

// UUID helper with fallback (avoids crypto.randomUUID() crashes)
const uuid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

function genAlert(symbol) {
  const strikes = [80, 90, 100, 105, 110, 120, 150, 200, 250, 300, 400, 500];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const now = new Date();
  const expiries = [7, 14, 21, 30, 45, 60].map((d) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  });
  const type = Math.random() > 0.5 ? "C" : "P";
  const strike = pick(strikes);
  const price = Math.max(0.2, Math.random() * 8).toFixed(2);
  const vol = Math.floor(Math.random() * 8000) + 1000;
  const oi = Math.floor(Math.random() * 15000) + 500;
  const notional = Math.round(Number(price) * 100 * vol);
  const reasons = [];
  if (vol > 4000) reasons.push("UNUSUAL_VOLUME");
  if (oi > 8000) reasons.push("UNUSUAL_OI");
  if (notional > 1000000) reasons.push("HIGH_NOTIONAL");

  return {
    id: uuid(),
    createdAt: now.toISOString(),
    symbol,
    expiry: pick(expiries),
    strike,
    type,
    last: Number(price),
    volume: vol,
    openInterest: oi,
    notionalUSD: notional,
    reason: reasons.join("+") || "FLOW",
  };
}

export async function runDemoScan(symbols) {
  const state = appStore.getState();
  const jobId = uuid();
  state.addScanJob({
    id: jobId,
    startedAt: new Date().toISOString(),
    status: "RUNNING",
    symbols,
    found: 0,
  });

  // generate 5–12 alerts
  const n = 5 + Math.floor(Math.random() * 8);
  const alerts = [];
  for (let i = 0; i < n; i++) {
    const sym = symbols[Math.floor(Math.random() * symbols.length)];
    alerts.push(genAlert(sym));
  }
  alerts.forEach((a) => state.pushAlert(a));
  state.updateScanJob(jobId, {
    finishedAt: new Date().toISOString(),
    status: "SUCCESS",
    found: alerts.length,
  });
  return alerts.length;
}

export function calcDemoExposure(symbol) {
  // Fake but deterministic numbers for GEX/DEX/PCR
  let seed = 0;
  for (const c of symbol) seed += c.charCodeAt(0);
  const GEX = (seed % 2000) - 1000;
  const DEX = (seed % 3000) - 1500;
  const PCR = ((seed % 60) + 40) / 100;
  return { GEX, DEX, pcrNotional: PCR };
}
