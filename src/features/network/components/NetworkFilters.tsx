import {
  countByKind,
  networkKindOrder,
  type NetworkKind,
  type NetworkNode,
} from '@/components/network/graph'
import { filterDotClass } from '@/components/network/node-style'
import { useT } from '@/app/LanguageProvider'
import type { TranslationKey } from '@/i18n/translate'
import { cn } from '@/lib/cn'

const kindKey: Record<NetworkKind, TranslationKey> = {
  suspect: 'network.suspect',
  witness: 'network.witness',
  victim: 'network.victim',
  officer: 'network.officer',
  person_of_interest: 'network.personOfInterest',
  evidence: 'network.evidence',
  place: 'network.place',
  event: 'network.event',
}

type NetworkFiltersProps = {
  nodes: NetworkNode[]
  hidden: ReadonlySet<NetworkKind>
  onToggle: (kind: NetworkKind) => void
}

export function NetworkFilters({ nodes, hidden, onToggle }: NetworkFiltersProps) {
  const { t } = useT()
  const counts = countByKind(nodes)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-start text-subtitle text-text-label">{t('network.filters')}</h2>
      {networkKindOrder.map((kind) => {
        if (counts[kind] === 0) return null
        const visible = !hidden.has(kind)
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={visible}
            onClick={() => onToggle(kind)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-inline py-2 text-start text-body',
              visible
                ? 'border-accent bg-surface-tint text-text'
                : 'border-field-border bg-field text-text-muted',
            )}
          >
            <span
              className={cn('size-4 shrink-0 rounded-full', filterDotClass[kind])}
              aria-hidden="true"
            />
            <span>{t(kindKey[kind])}</span>
            <span className="ms-auto font-latin">({counts[kind]})</span>
          </button>
        )
      })}
    </div>
  )
}

export function networkKindText(kind: NetworkKind, t: (key: TranslationKey) => string) {
  return t(kindKey[kind])
}
