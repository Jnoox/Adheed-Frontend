import { useNavigate, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { CaseStatusPill } from '@/components/ui/CaseStatusPill'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import type { TranslationKey } from '@/i18n/translate'
import type { Case } from '@/schemas'
import { useCase } from '../hooks/useCase'

const fields: Array<{ key: keyof Case; labelKey: TranslationKey }> = [
  { key: 'caseType', labelKey: 'cases.fileType' },
  { key: 'location', labelKey: 'cases.fileLocation' },
  { key: 'reportingAuthority', labelKey: 'cases.fileAuthority' },
  { key: 'investigator', labelKey: 'cases.fileInvestigator' },
]

export default function CaseFilePage() {
  const { caseId = '' } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { t } = useT()
  const caseQuery = useCase(caseId)

  if (caseQuery.isPending) {
    return <Spinner />
  }

  if (caseQuery.isError) {
    return (
      <ErrorState
        message={t('cases.fileLoadError')}
        onRetry={() => void caseQuery.refetch()}
      />
    )
  }

  const record = caseQuery.data

  return (
    <div className="flex flex-col gap-section">
      <div className="flex flex-wrap items-start justify-between gap-inline">
        <div className="flex flex-col gap-2 text-start">
          <div className="flex flex-wrap items-center gap-inline">
            <h1 className="text-title text-text">
              {t('cases.fileTitle')} <span className="font-latin">{record.caseNumber}</span>
            </h1>
            <CaseStatusPill status={record.status} />
          </div>
          {record.description ? (
            <p className="text-body text-text-muted">{record.description}</p>
          ) : null}
        </div>
        <Button variant="secondary" onClick={() => navigate('/cases')}>
          {t('common.back')}
        </Button>
      </div>

      <dl className="grid gap-inline sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className="flex flex-col gap-1 rounded-md border border-border bg-surface-raised p-inline text-start"
          >
            <dt className="text-caption text-text-label">{t(field.labelKey)}</dt>
            <dd className="text-body text-text">{record[field.key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
