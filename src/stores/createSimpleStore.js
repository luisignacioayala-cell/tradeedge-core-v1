import { useSyncExternalStore } from 'react'

export function createSimpleStore(initialState = {}){
  let state = { ...initialState }
  const listeners = new Set()
  const getState = () => state
  const setState = (partial) => {
    state = typeof partial === 'function' ? partial(state) : { ...state, ...partial }
    listeners.forEach(l=>l())
  }
  const subscribe = (l)=>{ listeners.add(l); return ()=>listeners.delete(l) }
  const useStore = (selector=(s)=>s) => useSyncExternalStore(subscribe, ()=>selector(state))
  return { getState, setState, subscribe, useStore }
}
