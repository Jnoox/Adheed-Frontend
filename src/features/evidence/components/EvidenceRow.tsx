import { Link } from 'react-router-dom'
import evidenceArrow from '@/assets/evidence-arrow.svg'
import { useT } from '@/app/LanguageProvider'
import evidenceCamera from '@/assets/evidence-camera.svg'
import evidenceClipboard from '@/assets/evidence-clipboard.svg'
import evidencePerson from '@/assets/evidence-person.svg'
import { cn } from '@/lib/cn'
import type { Evidence, EvidenceType } from '@/schemas'
import { evidenceShortKey } from '@/components/evidence/type-options'
import { EvidenceStatusPill } from '@/features/evidence/components/EvidenceStatusPill'
import {
  formatEvidenceMeta,
  isPendingEvidence,
} from '@/features/evidence/evidence-list'

const typeIcon: Record<
  EvidenceType,
  { src: string; width: number; height: number }
> = {
  photo: { src: evidenceCamera, width: 40, height: 33 },
  video: { src: evidenceCamera, width: 40, height: 33 },
  cctv: { src: evidenceCamera, width: 40, height: 33 },
  forensic_report: { src: evidenceClipboard, width: 29, height: 40 },
  medical_report: { src: evidenceClipboard, width: 29, height: 40 },
  digital: { src: evidenceClipboard, width: 29, height: 40 },
  other: { src: evidenceClipboard, width: 29, height: 40 },
  witness_statement: { src: evidencePerson, width: 26, height: 28 },
  suspect_statement: { src: evidencePerson, width: 26, height: 28 },
}

type EvidenceRowProps = {
  item: Evidence
}

export function EvidenceRow({ item }: EvidenceRowProps) {
  const { t } = useT()
  const pending = isPendingEvidence(item.status)
  const icon = typeIcon[item.type]

  return (
    <li
      className={cn(
        'flex items-center gap-inline rounded-lg border border-field-border bg-surface-raised px-inline py-3',
        pending && 'border-dashed',
      )}
    >
      <span className="flex size-[4.875rem] shrink-0 items-center justify-center rounded-lg bg-field">
        <img src={icon.src} alt="" width={icon.width} height={icon.height} />
      </span>
      <div className="min-w-0">
        <p className={cn('text-title', pending ? 'text-text-muted' : 'text-text')}>
          {item.name}
        </p>
        <p className="text-subtitle text-text-muted">
          {formatEvidenceMeta(item, t(evidenceShortKey[item.type]))}
        </p>
      </div>
      <div className="ms-auto flex shrink-0 items-center gap-inline">
        <EvidenceStatusPill status={item.status} />
        <Link
          to={`/cases/${item.caseId}/evidence/${item.id}`}
          className="inline-flex items-center gap-2 text-body text-accent"
        >
          {t('common.view')}
          <img
            src={evidenceArrow}
            alt=""
            width={16}
            height={15}
            className="rtl:rotate-180"
          />
        </Link>
      </div>
    </li>
  )
}
