import React from 'react'
import { useAppStore } from '../stores/useAppStore.js'

export default function Logs(){
  const logs = useAppStore(s=>s.logs)
  return (
    <div className="card">
      <h3>Logs</h3>
      <table className="table">
        <thead><tr><th>Time</th><th>Level</th><th>Scope</th><th>Message</th></tr></thead>
        <tbody>
          {logs.slice().reverse().map((l,i)=> (
            <tr key={i}>
              <td className="kbd">{new Date(l.ts).toLocaleTimeString()}</td>
              <td><span className="badge">{l.level}</span></td>
              <td>{l.scope}</td>
              <td>{l.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
