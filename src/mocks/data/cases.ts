export const CASE_ID = 'case-234587'

export const cases = [
  {
    id: CASE_ID,
    caseNumber: '23-4587',
    caseType: 'سرقة',
    reportedAt: '2026-03-12T17:05:00.000Z',
    location: 'مجمع الياسمين التجاري — محل النجمة للمجوهرات',
    description:
      'كسر واجهة محل مجوهرات ليلاً وسرقة مجموعة من القطع. بلاغ صاحب المحل بعد اكتشاف الكسر عند عودته من الجرد المسائي.',
    status: 'under_investigation' as const,
    createdAt: '2026-03-12T17:10:00.000Z',
    updatedAt: '2026-03-12T21:40:00.000Z',
  },
]
