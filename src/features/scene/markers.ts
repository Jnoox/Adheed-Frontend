import evidenceCamera from '@/assets/evidence-camera.svg'
import evidenceClipboard from '@/assets/evidence-clipboard.svg'
import evidencePerson from '@/assets/evidence-person.svg'
import type { EvidenceType } from '@/schemas'

export const evidenceMarker: Record<
  EvidenceType,
  { src: string; className: string }
> = {
  photo: { src: evidenceCamera, className: 'bg-evidence' },
  video: { src: evidenceCamera, className: 'bg-evidence' },
  cctv: { src: evidenceCamera, className: 'bg-evidence' },
  forensic_report: { src: evidenceClipboard, className: 'bg-accent' },
  medical_report: { src: evidenceClipboard, className: 'bg-accent' },
  digital: { src: evidenceClipboard, className: 'bg-accent' },
  other: { src: evidenceClipboard, className: 'bg-field' },
  witness_statement: { src: evidencePerson, className: 'bg-warning-surface' },
  suspect_statement: { src: evidencePerson, className: 'bg-warning-surface' },
}
