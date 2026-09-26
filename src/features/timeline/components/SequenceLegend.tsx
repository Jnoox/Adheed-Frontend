import { useT } from '@/app/LanguageProvider'
import { legendEntries } from '@/features/timeline/sequence'

export function SequenceLegend() {
  const { t } = useT()
  return (
    <div className="flex flex-wrap items-center justify-center gap-inline rounded-lg bg-field px-page py-3">
      {legendEntries().map((entry) => (
        <span
          key={entry.legendKey}
          className="inline-flex items-center gap-2 text-caption font-semibold text-text-label"
        >
          <img
            src={entry.dot.src}
            alt=""
            width={entry.dot.width}
            height={entry.dot.height}
          />
          {t(entry.legendKey)}
        </span>
      ))}
    </div>
  )
}
