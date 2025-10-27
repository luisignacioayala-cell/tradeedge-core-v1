import { createSimpleStore } from './createSimpleStore.js'

const initial = {
  connectionStatus: 'OFFLINE',
  watchlist: ['SPY','QQQ','AAPL','NVDA','TSLA'],
  quotesMap: {},
  optionsSnapshots: [],
  alerts: [],
  scanJobs: [],
  logs: [],
  appSettings: {
    useDemoMode: true,
    polygonApiKey: '',
    polygonWebSocketURL: 'wss://socket.polygon.io/stocks',
    polygonRESTBase: 'https://api.polygon.io',
    scanDefaultSymbols: ['SPY','QQQ','AAPL','NVDA','TSLA'],
    scannerNotionalUSDMin: 250000,
    scannerMinUnusualFactor: 3.0,
    updatedAt: new Date().toISOString()
  },
  session: { user: null }
}

const store = createSimpleStore(initial)

function addLog(entry){
  const log = { ts: new Date().toISOString(), level:'INFO', scope:'APP', message:'', meta:null, ...entry }
  store.setState(s=>({ logs: [...s.logs, log] }))
}

function setConnectionStatus(status){
  store.setState({ connectionStatus: status })
  addLog({ scope:'SOCKET', message:`Status -> ${status}` })
}

function setAppSettings(next){
  store.setState(s=>({ appSettings: { ...s.appSettings, ...next, updatedAt: new Date().toISOString() } }))
  addLog({ scope:'SETTINGS', message:'Settings updated' })
}

function addToWatchlist(symbol){
  if(!symbol) return
  symbol = symbol.toUpperCase()
  store.setState(s => (s.watchlist.includes(symbol) ? s : { watchlist: [...s.watchlist, symbol] }))
  addLog({ scope:'WATCHLIST', message:`Added ${symbol}` })
}

function removeFromWatchlist(symbol){
  store.setState(s => ({ watchlist: s.watchlist.filter(x=>x!==symbol) }))
  addLog({ scope:'WATCHLIST', message:`Removed ${symbol}` })
}

function upsertQuote(symbol, quote){
  store.setState(s=>({ quotesMap: { ...s.quotesMap, [symbol]: { ...(s.quotesMap[symbol]||{}), ...quote } } }))
}

function upsertOptionSnapshot(snapshot){
  store.setState(s=>{
    const idx = s.optionsSnapshots.findIndex(r=> r.symbol===snapshot.symbol && r.expiry===snapshot.expiry && r.strike===snapshot.strike && r.type===snapshot.type)
    const next = [...s.optionsSnapshots]
    if(idx>=0) next[idx] = { ...next[idx], ...snapshot }
    else next.push(snapshot)
    return { optionsSnapshots: next }
  })
}

function pushAlert(alert){
  store.setState(s=>({ alerts: [alert, ...s.alerts].slice(0,500) }))
  addLog({ scope:'ALERTS', message:`Alert ${alert.symbol} ${alert.reason}`, meta: alert })
}

function clearAlerts(){ store.setState({ alerts: [] }) }

function addScanJob(job){ store.setState(s=>({ scanJobs:[job, ...s.scanJobs].slice(0,200) })) }
function updateScanJob(id, patch){ store.setState(s=>({ scanJobs: s.scanJobs.map(j=> j.id===id?{...j,...patch}:j) })) }

store.setState(s=>({
  ...s,
  addLog, setConnectionStatus, setAppSettings,
  addToWatchlist, removeFromWatchlist, upsertQuote,
  upsertOptionSnapshot, pushAlert, clearAlerts,
  addScanJob, updateScanJob
}))

export function useAppStore(selector){ return store.useStore(selector) }
export const appStore = { getState: store.getState, setState: store.setState }
