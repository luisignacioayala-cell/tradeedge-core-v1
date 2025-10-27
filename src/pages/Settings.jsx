import React, { useState } from 'react'
import { useAppStore } from '../stores/useAppStore.js'

export default function Settings(){
  const s = useAppStore(x=>x)
  const [apiKey, setApiKey] = useState(s.appSettings.polygonApiKey)
  const [demo, setDemo] = useState(s.appSettings.useDemoMode)

  function save(){
    s.setAppSettings({ polygonApiKey: apiKey, useDemoMode: demo })
    if (demo) s.setConnectionStatus('LIVE')
    else s.setConnectionStatus('CONNECTING')
  }

  return (
    <div className="grid">
      <div className="card">
        <h3>Data</h3>
        <label>Polygon API Key</label>
        <input className="input" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="pk_..." />
        <div style={{marginTop:8, display:'flex', alignItems:'center', gap:8}}>
          <input id="demo" type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)} />
          <label htmlFor="demo">Use Demo Mode</label>
        </div>
        <div style={{marginTop:8}}>
          <button className="button primary" onClick={save}>Save</button>
        </div>
        <p className="badge" style={{marginTop:8}}>Live WebSocket is not implemented in this template; it's ready for you to wire Polygon later.</p>
      </div>
      <div className="card">
        <h3>Scanner Defaults</h3>
        <div className="kbd">Notional ≥ ${'{:,}'.format(250000)}</div>
        <div className="kbd">Unusual factor ≥ 3.0×</div>
        <p className="badge">Edit constants in store or add a form as needed.</p>
      </div>
    </div>
  )
}
