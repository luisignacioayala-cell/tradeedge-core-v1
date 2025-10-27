import React, { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Options from './pages/Options.jsx'
import Logs from './pages/Logs.jsx'
import Settings from './pages/Settings.jsx'
import { useAppStore } from './stores/useAppStore.js'

const tabs = ['Dashboard','Options','Logs','Settings']

export default function App(){
  const [tab,setTab]=useState('Dashboard')
  const status = useAppStore(s=>s.connectionStatus)
  return (
    <div>
      <div className="nav">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <strong>TradeEdge Core v1</strong>
        </div>
        <div className="tabs" role="tablist" aria-label="Pages">
          {tabs.map(t=>(
            <button key={t} role="tab" aria-selected={tab===t}
              className={'tab '+(tab===t?'active':'')} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>
        <div className={'pill '+status} aria-live="polite">{status}</div>
      </div>
      <div className="container">
        {tab==='Dashboard' && <Dashboard/>}
        {tab==='Options' && <Options/>}
        {tab==='Logs' && <Logs/>}
        {tab==='Settings' && <Settings/>}
      </div>
      <div className="footer">Demo Mode data included. Paste your Polygon key in Settings to go live.</div>
    </div>
  )
}
