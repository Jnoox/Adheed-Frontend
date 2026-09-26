import { useState, type FormEvent } from 'react'
import { useCreateEvidence } from '@/components/evidence/useCreateEvidence'
import {
  evidenceTypeKey,
  evidenceTypeValues,
} from '@/components/evidence/type-options'
import { useT } from '@/app/LanguageProvider'
import { Button } from '@/components/ui/Button'
import { FileField } from '@/components/ui/FileField'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { TextArea, TextField } from '@/components/ui/TextField'
import {
  createEvidenceInputSchema,
  type CreateEvidenceInput,
} from '@/schemas'

const emptyForm: CreateEvidenceInput = {
  type: 'photo',
  name: '',
  description: '',
  source: '',
  occurredAt: '',
}

type AddEvidenceModalProps = {
  caseId: string
  open: boolean
  onClose: () => void
}

export function AddEvidenceModal({
  caseId,
  open,
  onClose,
}: AddEvidenceModalProps) {
  const createEvidence = useCreateEvidence(caseId)
  const { t } = useT()
  const [values, setValues] = useState<CreateEvidenceInput>(emptyForm)
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateEvidenceInput, string>>
  >({})

  function update<K extends keyof CreateEvidenceInput>(
    key: K,
    value: CreateEvidenceInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function close() {
    setValues(emptyForm)
    setErrors({})
    onClose()
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = createEvidenceInputSchema.safeParse(values)
    if (!parsed.success) {
      const next: Partial<Record<keyof CreateEvidenceInput, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !(key in next)) {
          next[key as keyof CreateEvidenceInput] = t('common.required')
        }
      }
      setErrors(next)
      return
    }

    setErrors({})
    createEvidence.mutate(parsed.data, {
      onSuccess: () => {
        setValues(emptyForm)
        onClose()
      },
    })
  }

  return (
    <Modal open={open} title={t('evidence.modalTitle')} onClose={close}>
      <form onSubmit={onSubmit} className="flex flex-col gap-stack" noValidate>
        <Select
          name="type"
          label={t('evidence.type')}
          required
          value={values.type}
          options={evidenceTypeValues.map((value) => ({
            value,
            label: t(evidenceTypeKey[value]),
          }))}
          error={errors.type}
          onChange={(event) =>
            update('type', event.target.value as CreateEvidenceInput['type'])
          }
        />
        <TextField
          name="name"
          label={t('evidence.name')}
          required
          value={values.name}
          error={errors.name}
          onChange={(event) => update('name', event.target.value)}
        />
        <TextArea
          name="description"
          label={t('evidence.description')}
          required
          value={values.description}
          error={errors.description}
          onChange={(value) => update('description', value)}
        />
        <TextField
          name="source"
          label={t('evidence.source')}
          required
          value={values.source}
          error={errors.source}
          onChange={(event) => update('source', event.target.value)}
        />
        <TextField
          name="occurredAt"
          label={t('evidence.occurredAt')}
          required
          value={values.occurredAt}
          placeholder={t('evidence.occurredAtPlaceholder')}
          error={errors.occurredAt}
          onChange={(event) => update('occurredAt', event.target.value)}
        />
        <FileField name="file" label={t('evidence.file')} />
        <Button type="submit" loading={createEvidence.isPending}>
          {t('evidence.submit')}
        </Button>
      </form>
    </Modal>
  )
}
