import React, { useEffect, useState } from 'react'
import { useAppStore } from '../stores/useAppStore.js'
import { startDemoTicks } from '../services/marketDemo.js'

export default function Dashboard(){
  const { watchlist, quotesMap, addToWatchlist, removeFromWatchlist } = useAppStore(s=>s)
  const [sym, setSym] = useState('')
  useEffect(()=>{
    const stop = startDemoTicks()
    return ()=>{ if(stop) stop() }
  },[])

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Watchlist</h3>
        <div style={{display:'flex',gap:8,margin:'8px 0'}}>
          <input className="input" placeholder="e.g., AMD" value={sym} onChange={e=>setSym(e.target.value.toUpperCase())} />
          <button className="button primary" onClick={()=>{ if(sym) { addToWatchlist(sym); setSym('') } }}>Add</button>
        </div>
        <table className="table" aria-label="Watchlist table">
          <thead><tr><th>Symbol</th><th className="kbd" style={{textAlign:'right'}}>Last</th><th style={{textAlign:'right'}}>Δ</th><th style={{textAlign:'right'}}>%</th><th style={{textAlign:'right'}}>Vol</th><th>Time</th><th></th></tr></thead>
          <tbody>
            {watchlist.map(sym=>{
              const q = quotesMap[sym]||{}
              return (
                <tr key={sym}>
                  <td><strong>{sym}</strong></td>
                  <td style={{textAlign:'right'}} className="kbd">{q.last?.toFixed?.(2) ?? '-'}</td>
                  <td style={{textAlign:'right'}} className="kbd">{q.change?.toFixed?.(2) ?? '-'}</td>
                  <td style={{textAlign:'right'}} className="kbd">{q.changePct?.toFixed?.(2) ?? '-'}</td>
                  <td style={{textAlign:'right'}} className="kbd">{q.volume ?? '-'}</td>
                  <td className="kbd">{q.ts ? new Date(q.ts).toLocaleTimeString() : '-'}</td>
                  <td><button className="button" onClick={()=>removeFromWatchlist(sym)}>Remove</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Top Movers (Demo)</h3>
        <p className="badge">REST fallback placeholder. In live mode, call Polygon snapshots.</p>
        <ul>
          {['UPST','PLTR','ROKU','NVDA','AAPL'].map(t=>(<li key={t}><strong>{t}</strong> moving…</li>))}
        </ul>
      </div>
    </div>
  )
}
