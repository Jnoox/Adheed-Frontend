import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import backArrow from '@/assets/back-arrow.svg'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { TextArea, TextField } from '@/components/ui/TextField'
import { useCreateCase } from '@/features/cases/hooks/useCreateCase'
import {
  createCaseInputSchema,
  type CaseStatus,
  type CreateCaseInput,
} from '@/schemas'

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
  const statusOptions: Array<{ value: CaseStatus; label: string }> = [
    { value: 'active', label: t('cases.statusActive') },
    { value: 'suspended', label: t('cases.statusSuspended') },
    { value: 'closed', label: t('cases.statusClosed') },
  ]
  const [values, setValues] = useState<CreateCaseInput>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CreateCaseInput, string>>>(
    {},
  )

  function update<K extends keyof CreateCaseInput>(key: K, value: CreateCaseInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = createCaseInputSchema.safeParse(values)
    if (!parsed.success) {
      const next: Partial<Record<keyof CreateCaseInput, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !(key in next)) {
          next[key as keyof CreateCaseInput] = t('common.required')
        }
      }
      setErrors(next)
      return
    }

    setErrors({})
    createCase.mutate(parsed.data, {
      onSuccess: (created) => {
        navigate(`/cases/${created.id}`)
      },
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex min-h-svh flex-col bg-surface" noValidate>
      <header className="flex items-center justify-between gap-inline bg-accent px-page py-3">
        <button
          type="button"
          onClick={() => navigate('/cases')}
          className="flex items-center gap-2 text-text-inverse"
        >
          <img src={backArrow} alt="" width={20} height={15} className="shrink-0 ltr:rotate-180" />
          <h1 className="text-title">{t('cases.createTitle')}</h1>
        </button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="onInverse" onClick={() => navigate('/cases')}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="inverse" loading={createCase.isPending}>
            {t('cases.createFile')}
          </Button>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-2 content-start gap-x-section gap-y-section p-page">
        <TextField
          name="caseNumber"
          label={t('cases.caseNumber')}
          required
          value={values.caseNumber}
          placeholder={t('cases.caseNumberPlaceholder')}
          error={errors.caseNumber}
          onChange={(event) => update('caseNumber', event.target.value)}
        />
        <TextField
          name="reportingAuthority"
          label={t('cases.authority')}
          value={values.reportingAuthority}
          placeholder={t('cases.authorityPlaceholder')}
          onChange={(event) => update('reportingAuthority', event.target.value)}
        />
        <TextField
          name="caseType"
          label={t('cases.caseType')}
          required
          value={values.caseType}
          placeholder={t('cases.caseTypePlaceholder')}
          error={errors.caseType}
          onChange={(event) => update('caseType', event.target.value)}
        />
        <TextField
          name="investigator"
          label={t('cases.investigator')}
          value={values.investigator}
          placeholder={t('cases.investigatorPlaceholder')}
          onChange={(event) => update('investigator', event.target.value)}
        />
        <TextField
          name="reportedAt"
          label={t('cases.reportedAt')}
          required
          value={values.reportedAt}
          placeholder={t('cases.reportedAtPlaceholder')}
          error={errors.reportedAt}
          onChange={(event) => update('reportedAt', event.target.value)}
        />
        <SegmentedControl
          name="status"
          label={t('cases.status')}
          value={values.status}
          options={statusOptions}
          onChange={(status) => update('status', status)}
        />
        <TextField
          name="location"
          label={t('cases.location')}
          required
          value={values.location}
          placeholder={t('cases.locationPlaceholder')}
          error={errors.location}
          onChange={(event) => update('location', event.target.value)}
        />
        <TextArea
          name="description"
          label={t('cases.description')}
          value={values.description}
          placeholder={t('cases.descriptionPlaceholder')}
          onChange={(value) => update('description', value)}
        />
      </div>
      {createCase.isError ? (
        <div className="px-page pb-page">
          <ErrorState message={t('cases.createError')} />
        </div>
      ) : null}
    </form>
  )
}
