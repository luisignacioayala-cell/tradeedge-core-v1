import React, { useEffect, useState } from 'react'
import { useAppStore } from '../stores/useAppStore.js'
import { startDemoTicks } from '../services/marketDemo.js'

export default function Dashboard(){
  // Select slices with safe defaults in case store isn't ready on first paint
  const watchlist = useAppStore(s => Array.isArray(s.watchlist) ? s.watchlist : [])
  const quotesMap = useAppStore(s => s?.quotesMap ?? {})
  const addToWatchlist = useAppStore(s => s?.addToWatchlist ?? (()=>{}))
  const removeFromWatchlist = useAppStore(s => s?.removeFromWatchlist ?? (()=>{}))

  const [sym, setSym] = useState('')

  useEffect(()=>{
    const stop = startDemoTicks?.()
    return ()=>{ if(typeof stop === 'function') stop() }
  },[])

  const safeWatchlist = Array.isArray(watchlist) ? watchlist : []

  return (
    <div className="grid grid-2">
      <div className="card">
        <h3>Watchlist</h3>
        <div style={{display:'flex',gap:8,margin:'8px 0'}}>
          <input
            className="input"
            placeholder="e.g., AMD"
            value={sym}
            onChange={e=>setSym(e.target.value.toUpperCase().slice(0,5))}
          />
          <button
            className="button primary"
            onClick={()=>{ if(sym.trim()) { addToWatchlist(sym.trim()); setSym('') } }}
          >
            Add
          </button>
        </div>

        {safeWatchlist.length === 0 ? (
          <div className="badge">No symbols yet — add one above.</div>
        ) : (
          <table className="table" aria-label="Watchlist table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="kbd" style={{textAlign:'right'}}>Last</th>
                <th style={{textAlign:'right'}}>Δ</th>
                <th style={{textAlign:'right'}}>%</th>
                <th style={{textAlign:'right'}}>Vol</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {safeWatchlist.map(sy=>{
                const q = quotesMap?.[sy] ?? {}
                return (
                  <tr key={sy}>
                    <td><strong>{sy}</strong></td>
                    <td style={{textAlign:'right'}} className="kbd">{q.last ?? '-'}</td>
                    <td style={{textAlign:'right'}} className="kbd">{q.change ?? '-'}</td>
                    <td style={{textAlign:'right'}} className="kbd">{q.changePct ?? '-'}</td>
                    <td style={{textAlign:'right'}} className="kbd">{q.volume ?? '-'}</td>
                    <td className="kbd">{q.ts ? new Date(q.ts).toLocaleTimeString() : '-'}</td>
                    <td><button className="button" onClick={()=>removeFromWatchlist(sy)}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Top Movers (Demo)</h3>
        <p className="badge">REST fallback placeholder. In live mode, call Polygon snapshots.</p>
        <ul>
          {['UPST','PLTR','ROKU','NVDA','AAPL'].map(t=>(
            <li key={t}><strong>{t}</strong> moving…</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
