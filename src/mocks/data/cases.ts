import type { Case } from '@/schemas'

export const CASE_ID = 'case-234587'

export const cases: Case[] = [
  {
    id: CASE_ID,
    caseNumber: '23-4587',
    caseType: 'سرقة متجر مجوهرات',
    reportedAt: '2026-03-12T17:05:00.000Z',
    location: 'مجمع الياسمين التجاري — محل النجمة للمجوهرات',
    description:
      'كسر واجهة محل مجوهرات ليلاً وسرقة مجموعة من القطع. بلاغ صاحب المحل بعد اكتشاف الكسر عند عودته من الجرد المسائي.',
    reportingAuthority: 'شرطة منطقة الرياض',
    investigator: 'أحمد الدوسري',
    status: 'active' as const,
    createdAt: '2026-03-12T17:10:00.000Z',
    updatedAt: '2026-03-12T21:40:00.000Z',
  },
  {
    id: 'case-234521',
    caseNumber: '23-4521',
    caseType: 'اختلاس مالي',
    reportedAt: '2026-02-02T08:00:00.000Z',
    location: 'مكتب تجريبي — حي الأعمال',
    description: 'نقص في عهدة صندوق تجريبي. كل الأسماء والبيانات مختلقة.',
    reportingAuthority: '',
    investigator: '',
    status: 'active' as const,
    createdAt: '2026-02-02T08:10:00.000Z',
    updatedAt: '2026-02-20T12:00:00.000Z',
  },
  {
    id: 'case-234498',
    caseNumber: '23-4498',
    caseType: 'حادث مروري',
    reportedAt: '2025-11-18T06:30:00.000Z',
    location: 'تقاطع تجريبي — طريق الخدمات',
    description: 'تصادم مركبتين على طريق تجريبي. الملف مقفل للعرض فقط. بيانات مختلقة.',
    reportingAuthority: '',
    investigator: '',
    status: 'closed' as const,
    createdAt: '2025-11-18T06:40:00.000Z',
    updatedAt: '2026-01-04T10:00:00.000Z',
  },
]
