import { CASE_ID } from './cases'

export const auditEntries = [
  {
    id: 'aud-01',
    caseId: CASE_ID,
    action: 'case.created',
    actor: 'محقق تجريبي',
    occurredAt: '2026-03-12T17:10:00.000Z',
    details: 'إنشاء القضية 23-4587.',
  },
  {
    id: 'aud-02',
    caseId: CASE_ID,
    action: 'evidence.added',
    actor: 'محقق تجريبي',
    occurredAt: '2026-03-12T18:00:00.000Z',
    details: 'إضافة تسجيل كاميرا الموقف الخلفي.',
  },
  {
    id: 'aud-03',
    caseId: CASE_ID,
    action: 'evidence.added',
    actor: 'محقق تجريبي',
    occurredAt: '2026-03-12T18:20:00.000Z',
    details: 'إضافة إفادة فهد القحطاني.',
  },
  {
    id: 'aud-04',
    caseId: CASE_ID,
    action: 'case.updated',
    actor: 'محقق تجريبي',
    occurredAt: '2026-03-12T21:40:00.000Z',
    details: 'تحديث وصف القضية بعد الجرد الأولي.',
  },
]
