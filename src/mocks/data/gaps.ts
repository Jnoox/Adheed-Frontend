import { CASE_ID } from './cases'

export const gaps = [
  {
    id: 'gap-01',
    caseId: CASE_ID,
    summary: 'فجوة في تغطية الممر الداخلي بين 19:15 و 19:40.',
    reason:
      'تسجيل الممر يتوقف عند 19:15 ولا يعود إلا بعد صوت الزجاج. لا يوجد مصدر يملأ هذه المدة.',
    evidenceIds: ['ev-cctv-01', 'ev-witness-01'],
    certainty: 'uncertain' as const,
    startsAt: '2026-03-12T16:15:00.000Z',
    endsAt: '2026-03-12T16:40:00.000Z',
    beforeEventId: 'evt-05',
    afterEventId: 'evt-06',
  },
]
