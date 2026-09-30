import { useState, type FormEvent } from 'react'
import backArrow from '@/assets/back-arrow.svg'
import { useT } from '@/app/LanguageProvider'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { controlFocus } from '@/components/ui/control'
import { ErrorState } from '@/components/ui/ErrorState'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { TextArea, TextField } from '@/components/ui/TextField'
import {
  createCaseInputSchema,
  type CaseStatus,
  type CreateCaseInput,
} from '@/schemas'

type CaseFormProps = {
  title: string
  submitLabel: string
  initialValues: CreateCaseInput
  caseNumberLocked?: boolean
  submitting: boolean
  errorMessage: string | null
  onCancel: () => void
  onSubmit: (values: CreateCaseInput) => void
}

export function CaseForm({
  title,
  submitLabel,
  initialValues,
  caseNumberLocked = false,
  submitting,
  errorMessage,
  onCancel,
  onSubmit,
}: CaseFormProps) {
  const { t } = useT()
  const statusOptions: Array<{ value: CaseStatus; label: string }> = [
    { value: 'active', label: t('cases.statusActive') },
    { value: 'suspended', label: t('cases.statusSuspended') },
    { value: 'closed', label: t('cases.statusClosed') },
  ]
  const [values, setValues] = useState<CreateCaseInput>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof CreateCaseInput, string>>>({})

  function update<K extends keyof CreateCaseInput>(key: K, value: CreateCaseInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
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
    onSubmit({
      ...parsed.data,
      caseNumber: caseNumberLocked ? initialValues.caseNumber : parsed.data.caseNumber,
    })
  }

  return (
    <form onSubmit={onFormSubmit} className="flex min-h-svh flex-col bg-surface" noValidate>
      <header className="flex items-center justify-between gap-inline bg-accent px-page py-3">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            'inline-flex min-h-11 items-center gap-2 px-4 text-text-inverse',
            controlFocus,
          )}
        >
          <img src={backArrow} alt="" width={20} height={15} className="shrink-0 ltr:rotate-180" />
          <h1 className="text-title">{title}</h1>
        </button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="onInverse" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="inverse" loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-2 content-start gap-x-section gap-y-section p-page">
        <TextField
          name="caseNumber"
          label={t('cases.caseNumber')}
          required
          disabled={caseNumberLocked}
          note={caseNumberLocked ? t('cases.numberLocked') : undefined}
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
      {errorMessage ? (
        <div className="px-page pb-page">
          <ErrorState message={errorMessage} />
        </div>
      ) : null}
    </form>
  )
}
