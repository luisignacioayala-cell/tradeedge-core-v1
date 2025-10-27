// Simulated live quotes & simple ping for Demo Mode
import { appStore } from '../stores/useAppStore.js'

const rand = (min,max)=> Math.random()*(max-min)+min

export function startDemoTicks(){
  const s = appStore.getState()
  if(!s.appSettings?.useDemoMode) return
  appStore.setState({ connectionStatus: 'LIVE' })
  const base = { SPY: 520, QQQ: 450, AAPL: 230, NVDA: 120, TSLA: 200 }
  const t = setInterval(()=>{
    const st = appStore.getState()
    st.watchlist.forEach(sym=>{
      const prev = st.quotesMap[sym]?.last ?? (base[sym]||100)
      const last = prev * (1 + (Math.random()-0.5)*0.0004) // ±0.02%
      st.upsertQuote(sym, {
        last: Number(last.toFixed(2)),
        change: Number((last - (base[sym]||prev)).toFixed(2)),
        changePct: Number(((last/(base[sym]||prev)-1)*100).toFixed(2)),
        volume: Math.floor(rand(100000, 5000000)),
        ts: new Date().toISOString()
      })
    })
  }, 1000)
  return ()=>clearInterval(t)
}
