import { useNavigate } from 'react-router-dom'
import { useT } from '@/app/LanguageProvider'
import { CaseForm } from '@/features/cases/components/CaseForm'
import { useCreateCase } from '@/features/cases/hooks/useCreateCase'
import type { CreateCaseInput } from '@/schemas'

const emptyForm: CreateCaseInput = {
  caseNumber: '',
  caseType: '',
  reportedAt: '',
  location: '',
  description: '',
  reportingAuthority: '',
  investigator: '',
  status: 'active',
}

export default function CreateCasePage() {
  const navigate = useNavigate()
  const createCase = useCreateCase()
  const { t } = useT()

  return (
    <CaseForm
      title={t('cases.createTitle')}
      submitLabel={t('cases.createFile')}
      initialValues={emptyForm}
      submitting={createCase.isPending}
      errorMessage={createCase.isError ? t('cases.createError') : null}
      onCancel={() => navigate('/cases')}
      onSubmit={(input) => {
        createCase.mutate(input, {
          onSuccess: (created) => {
            navigate(`/cases/${created.id}`)
          },
        })
      }}
    />
  )
}
