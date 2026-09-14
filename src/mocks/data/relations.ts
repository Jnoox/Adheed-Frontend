import { CASE_ID } from './cases'

export const relations = [
  {
    id: 'rel-01',
    caseId: CASE_ID,
    fromType: 'evidence' as const,
    fromId: 'ev-cctv-01',
    toType: 'person' as const,
    toId: 'person-03',
    reason: 'السيارة في الموقف الخلفي تطابق وصفاً سابقاً لمركبة فهد.',
    evidenceIds: ['ev-cctv-01'],
  },
  {
    id: 'rel-02',
    caseId: CASE_ID,
    fromType: 'evidence' as const,
    fromId: 'ev-digital-01',
    toType: 'place' as const,
    toId: 'place-02',
    reason: 'سجل الباب الإلكتروني يخص مدخل الخدمة خلف المجمع.',
    evidenceIds: ['ev-digital-01'],
  },
  {
    id: 'rel-03',
    caseId: CASE_ID,
    fromType: 'evidence' as const,
    fromId: 'ev-witness-01',
    toType: 'event' as const,
    toId: 'evt-06',
    reason: 'الإفادة تضع صوت الزجاج عند الممر المجاور للمحل.',
    evidenceIds: ['ev-witness-01'],
  },
  {
    id: 'rel-04',
    caseId: CASE_ID,
    fromType: 'person' as const,
    fromId: 'person-01',
    toType: 'place' as const,
    toId: 'place-01',
    reason: 'أحمد هو صاحب المحل ومصدر الجرد.',
    evidenceIds: ['ev-other-01'],
  },
]
