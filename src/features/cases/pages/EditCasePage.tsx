import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { ErrorState } from '@/components/ui/ErrorState'
import { Spinner } from '@/components/ui/Spinner'
import { CaseForm } from '@/features/cases/components/CaseForm'
import { useCase } from '@/features/cases/hooks/useCase'
import { useUpdateCase } from '@/features/cases/hooks/useUpdateCase'
import type { CreateCaseInput } from '@/schemas'

function originOf(state: unknown, fallback: string) {
  if (state && typeof state === 'object' && 'from' in state && typeof state.from === 'string') {
    return state.from
  }
  return fallback
}

export default function EditCasePage() {
  const { caseId = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const caseQuery = useCase(caseId)
  const updateCase = useUpdateCase(caseId)
  const { t } = useT()
  const backTo = originOf(location.state, `/cases/${caseId}`)

  if (caseQuery.isPending) return <Spinner />
  if (caseQuery.isError || !caseQuery.data) {
    return (
      <ErrorState
        message={t('cases.fileLoadError')}
        onRetry={() => void caseQuery.refetch()}
      />
    )
  }

  const record = caseQuery.data
  const initialValues: CreateCaseInput = {
    caseNumber: record.caseNumber,
    caseType: record.caseType,
    reportedAt: record.reportedAt,
    location: record.location,
    description: record.description,
    reportingAuthority: record.reportingAuthority,
    investigator: record.investigator,
    status: record.status,
  }

  return (
    <CaseForm
      title={t('cases.editTitle')}
      submitLabel={t('cases.saveEdits')}
      initialValues={initialValues}
      caseNumberLocked
      submitting={updateCase.isPending}
      errorMessage={updateCase.isError ? t('cases.editError') : null}
      onCancel={() => navigate(backTo)}
      onSubmit={(input) => {
        updateCase.mutate(input, {
          onSuccess: () => {
            navigate(backTo)
          },
        })
      }}
    />
  )
}
