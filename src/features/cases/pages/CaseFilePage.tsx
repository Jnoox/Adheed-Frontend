import { useParams, useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { useCase } from '../hooks/useCase'
import { CaseStatusPill } from '@/features/dashboard/components/CaseStatusPill'

export default function CaseFilePage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { t } = useT()
  
  const caseQuery = useCase(caseId!)

  if (caseQuery.isPending) {
    return <Spinner />
  }

  if (caseQuery.isError) {
    return (
      <ErrorState
        message={t('dashboard.loadError')}
        onRetry={() => void caseQuery.refetch()}
      />
    )
  }

  const c = caseQuery.data

  return (
    <div className="flex flex-col gap-section">
      <div className="flex items-center justify-between gap-inline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1">{c.caseNumber}</h1>
            <CaseStatusPill status={c.status} />
          </div>
          <p className="text-text-muted mt-2">{c.description}</p>
        </div>
        <Button onClick={() => navigate('/cases')} variant="secondary">
          {t('common.back')}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 bg-surface-elevated rounded-md border border-border-subtle">
          <h2 className="text-label text-text-muted mb-1">Case Type</h2>
          <p>{c.caseType}</p>
        </div>
        <div className="p-4 bg-surface-elevated rounded-md border border-border-subtle">
          <h2 className="text-label text-text-muted mb-1">Location</h2>
          <p>{c.location}</p>
        </div>
        <div className="p-4 bg-surface-elevated rounded-md border border-border-subtle">
          <h2 className="text-label text-text-muted mb-1">Reporting Authority</h2>
          <p>{c.reportingAuthority}</p>
        </div>
        <div className="p-4 bg-surface-elevated rounded-md border border-border-subtle">
          <h2 className="text-label text-text-muted mb-1">Investigator</h2>
          <p>{c.investigator}</p>
        </div>
      </div>
    </div>
  )
}
