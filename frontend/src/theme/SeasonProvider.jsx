import { createContext, useContext } from 'react'
import SeasonBackdrop from './SeasonBackdrop'
import { normalizeSeason } from './seasons'

const SeasonContext = createContext('default')

export function useSeason() {
  return useContext(SeasonContext)
}

export function SeasonProvider({ season, children }) {
  const key = normalizeSeason(season)
  return (
    <SeasonContext.Provider value={key}>
      <div data-theme={key} className="relative min-h-dvh text-[var(--c-ink)]">
        <SeasonBackdrop season={key} />
        <div className="relative z-10">{children}</div>
      </div>
    </SeasonContext.Provider>
  )
}
