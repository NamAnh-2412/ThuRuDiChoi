import SeasonBadge from '../common/SeasonBadge'
import { SeasonProvider } from '../../theme/SeasonProvider'

export default function SpecialStepLayout({ season, children }) {
  return (
    <SeasonProvider season={season}>
      <main className="screen-stage bg-gradient-to-b from-[var(--c-bg-from)] to-[var(--c-bg-to)]">
        <div className="letter-frame">
          <SeasonBadge season={season} />
          {children}
        </div>
      </main>
    </SeasonProvider>
  )
}
