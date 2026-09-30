import type { Suggestion } from '@/schemas'
import { CASE_ID } from './cases'

export const suggestions: Suggestion[] = [
  {
    id: 'sug-01',
    caseId: CASE_ID,
    summary: 'قد يكون فتح الباب الخلفي مرتبطاً بتوقف السيارة في الموقف.',
    reason:
      'الفاصل الزمني بين توقف السيارة وفتح الباب أقل من عشر دقائق، وكلاهما عند مدخل الخدمة.',
    evidenceIds: ['ev-cctv-01', 'ev-digital-01'],
    certainty: 'inference' as const,
    status: 'pending' as const,
  },
  {
    id: 'sug-02',
    caseId: CASE_ID,
    summary:
      'تسلسل محتمل: توقّف المركبة في الموقف، ثم فتح مدخل الخدمة، ثم الوصول إلى الواجهة أثناء انقطاع الممر.',
    reason:
      'ترتيب الأزمنة المتاحة يضع الموقف ثم الباب ثم فجوة الكاميرات ثم صوت الزجاج. الخطوات غير المؤكدة استدلال من التتابع لا من مصدر واحد.',
    evidenceIds: ['ev-cctv-01', 'ev-digital-01', 'ev-witness-01'],
    certainty: 'inference' as const,
    status: 'pending' as const,
  },
  {
    id: 'sug-03',
    caseId: CASE_ID,
    summary: 'قد يكون رمز الباب غير المجدول مرتبطاً بحامل غير مُحدَّد بعد.',
    reason:
      'السجل يُظهر رمزاً خارج جدول المناوبة، ولا يوجد مصدر يسمّي حامله. الربط تخميني حتى يُراجع سجل الموظفين.',
    evidenceIds: ['ev-digital-01'],
    certainty: 'uncertain' as const,
    status: 'pending' as const,
  },
]
