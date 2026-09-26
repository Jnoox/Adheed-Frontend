import noticeIcon from '@/assets/analysis-notice.svg'
import { useT } from '@/app/LanguageProvider'
import { matchToneClass } from '@/features/analysis/match'
import type { ScenarioColumn } from '@/features/analysis/compare'

type ScenarioComparisonProps = {
  columns: ScenarioColumn[]
}

export function ScenarioComparison({ columns }: ScenarioComparisonProps) {
  const { t } = useT()
  return (
    <section className="flex flex-col gap-stack">
      <h2 className="text-start text-subtitle font-semibold text-accent">
        {t('analysis.compare')}
      </h2>
      {columns.length === 0 ? (
        <p className="text-body text-text-muted">{t('analysis.noScenarios')}</p>
      ) : (
        <div className="overflow-hidden rounded-field border border-field-border">
          <table className="w-full border-collapse text-center text-subtitle">
            <thead className="bg-surface text-text-label">
              <tr>
                <th className="px-inline py-4 font-normal">{t('analysis.criterion')}</th>
                {columns.map((column) => (
                  <th key={column.id} className="px-inline py-4 font-normal">
                    {column.rankKey ? t(column.rankKey) : column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-field-border bg-surface-raised">
                <th className="px-inline py-4 font-normal text-text-label">
                  {t('analysis.totalMatch')}
                </th>
                {columns.map((column) => (
                  <td key={column.id} className="px-inline py-4">
                    <span
                      className={`inline-flex min-w-16 items-center justify-center rounded-lg px-3 py-1 font-latin text-body ${matchToneClass[column.tone]}`}
                    >
                      {column.matchPercent}%
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-t border-field-border bg-surface-tint">
                <th className="px-inline py-4 font-normal text-text-label">
                  {t('analysis.supporting')}
                </th>
                {columns.map((column) => (
                  <td key={column.id} className="px-inline py-4 font-latin text-accent">
                    {column.supportingCount}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-field-border bg-surface-raised">
                <th className="px-inline py-4 font-normal text-text-label">
                  {t('analysis.criterion')}
                </th>
                {columns.map((column) => (
                  <td key={column.id} className="px-inline py-4 font-latin text-danger">
                    {column.conflictCount}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-start gap-2 rounded-field bg-surface px-page py-3 text-body text-accent">
        <img src={noticeIcon} alt="" width={18} height={18} />
        <p>{t('analysis.decisionNotice')}</p>
      </div>
    </section>
  )
}
