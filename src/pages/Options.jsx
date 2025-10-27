import React, { useMemo, useState } from 'react'
import { useAppStore } from '../stores/useAppStore.js'
import { runDemoScan, calcDemoExposure } from '../services/optionsScanner.js'

export default function Options(){
  const s = useAppStore(x=>x)
  const [running, setRunning] = useState(false)
  const [symbols, setSymbols] = useState(s.appSettings.scanDefaultSymbols.join(','))

  const exposures = useMemo(()=>{
    const map = {}
    s.watchlist.slice(0,4).forEach(sym=> map[sym] = calcDemoExposure(sym))
    return map
  },[s.watchlist])

  async function onScan(){
    setRunning(true)
    await new Promise(r=>setTimeout(r, 400))
    const list = symbols.split(',').map(x=>x.trim().toUpperCase()).filter(Boolean)
    await runDemoScan(list.length?list:s.watchlist)
    setRunning(false)
  }

  return (
    <div className="grid">
      <div className="grid grid-3">
        {Object.entries(exposures).map(([sym,ex])=>(
          <div key={sym} className="card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <strong>{sym}</strong><span className="badge">Exposure</span>
            </div>
            <div className="kbd">GEX: {ex.GEX}</div>
            <div className="kbd">DEX: {ex.DEX}</div>
            <div className="kbd">PCR Notional: {ex.pcrNotional.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
          <input className="input" style={{flex:1}} placeholder="Symbols comma separated (SPY,QQQ,…)" value={symbols} onChange={e=>setSymbols(e.target.value)} />
          <button className="button primary" disabled={running} onClick={onScan}>{running?'Scanning…':'Run Scan Now'}</button>
        </div>
        <table className="table">
          <thead><tr><th>Time</th><th>Symbol</th><th>Expiry</th><th>Strike</th><th>Type</th><th>Last</th><th>Vol</th><th>OI</th><th>Notional</th><th>Reason</th></tr></thead>
          <tbody>
            {s.alerts.map(a=> (
              <tr key={a.id}>
                <td className="kbd">{new Date(a.createdAt).toLocaleTimeString()}</td>
                <td><strong>{a.symbol}</strong></td>
                <td>{a.expiry}</td>
                <td className="kbd" style={{textAlign:'right'}}>{a.strike}</td>
                <td>{a.type}</td>
                <td className="kbd" style={{textAlign:'right'}}>{a.last.toFixed(2)}</td>
                <td className="kbd" style={{textAlign:'right'}}>{a.volume}</td>
                <td className="kbd" style={{textAlign:'right'}}>{a.openInterest}</td>
                <td className="kbd" style={{textAlign:'right'}}>${a.notionalUSD.toLocaleString()}</td>
                <td>{a.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
