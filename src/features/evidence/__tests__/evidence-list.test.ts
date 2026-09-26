import { ar } from '@/i18n/ar'
import { evidenceMatchesQuery, type EvidenceLabelSet } from '@/features/evidence/evidence-list'
import type { EvidenceType } from '@/schemas'

const short: EvidenceLabelSet = {
  photo: ar.evidence.shortPhoto,
  video: ar.evidence.shortVideo,
  cctv: ar.evidence.shortVideo,
  forensic_report: ar.evidence.shortReport,
  medical_report: ar.evidence.shortReport,
  witness_statement: ar.evidence.shortStatement,
  suspect_statement: ar.evidence.shortStatement,
  digital: ar.evidence.shortDigital,
  other: ar.evidence.shortOther,
}

const option: EvidenceLabelSet = {
  photo: ar.evidence.optionPhoto,
  video: ar.evidence.optionVideo,
  cctv: ar.evidence.optionCctv,
  forensic_report: ar.evidence.optionForensic,
  medical_report: ar.evidence.optionMedical,
  witness_statement: ar.evidence.optionWitness,
  suspect_statement: ar.evidence.optionSuspect,
  digital: ar.evidence.optionDigital,
  other: ar.evidence.optionOther,
}

const labels = { short, option }

const photo = { name: 'صورة الواجهة المحطمة', type: 'photo' as EvidenceType }
const video = { name: 'مقطع الشاهدة أمام الممر', type: 'video' as EvidenceType }
const report = { name: 'تقرير فحص آثار الكسر', type: 'forensic_report' as EvidenceType }

describe('evidence search', () => {
  it('matches on name and type', () => {
    expect(evidenceMatchesQuery(photo, 'الواجهة', labels)).toBe(true)
    expect(evidenceMatchesQuery(video, 'الواجهة', labels)).toBe(false)

    expect(evidenceMatchesQuery(video, 'فيديو', labels)).toBe(true)
    expect(evidenceMatchesQuery(video, 'video', labels)).toBe(true)
    expect(evidenceMatchesQuery(photo, 'فيديو', labels)).toBe(false)

    expect(evidenceMatchesQuery(report, 'تقرير', labels)).toBe(true)
    expect(evidenceMatchesQuery(report, 'forensic', labels)).toBe(true)
  })
})
