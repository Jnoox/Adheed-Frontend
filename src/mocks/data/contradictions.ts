import { CASE_ID } from './cases'

export const contradictions = [
  {
    id: 'con-01',
    caseId: CASE_ID,
    summary: 'تعارض بين إفادة فهد وتسجيل الموقف الخلفي.',
    reason:
      'الإفادة تضع فهد في المنزل عند الساعة 19:00 بينما التسجيل يُظهر مركبة مطابقة في الموقف عند 19:05. ربط المركبة بفهد استدلال من الوصف لا مطابقة مؤكدة.',
    evidenceIds: ['ev-suspect-01', 'ev-cctv-01'],
    certainty: 'inference' as const,
    leftLabel: 'إفادة فهد: كان في المنزل',
    rightLabel: 'الكاميرا 4: مركبة في الموقف الخلفي',
    reviewed: false,
  },
  {
    id: 'con-02',
    caseId: CASE_ID,
    summary: 'تعارض في الطابع الزمني داخل ملف كاميرا الموقف.',
    reason:
      'حقل DateTimeOriginal في بيانات الملف يثبّت بداية المقطع عند 19:05:00، بينما شريط الوقت المحفور في نفس الملف يعرض 19:00:00. كلاهما سجلّ آلي من الجهاز وليس تأويلاً.',
    evidenceIds: ['ev-cctv-01'],
    certainty: 'fact' as const,
    leftLabel: 'بيانات الملف: 19:05:00',
    rightLabel: 'الشريط المحفور في التسجيل: 19:00:00',
    reviewed: false,
  },
  {
    id: 'con-03',
    caseId: CASE_ID,
    summary: 'تعارض بين إفادة فهد وإفادة الحارس عن وجوده في المجمع.',
    reason:
      'فهد يصرّح أنه غادر المجمع ظهراً وبقي في المنزل مساءً. خالد يصرّح أنه رأى فهد عند البوابة بعد العصر. المصدران يشهدان مباشرة على روايتين لا تجتمعان.',
    evidenceIds: ['ev-suspect-01', 'ev-witness-02'],
    certainty: 'evidence' as const,
    leftLabel: 'إفادة فهد: غادرت ظهراً وبقيت في المنزل',
    rightLabel: 'إفادة خالد: رأيت فهد عند البوابة بعد العصر',
    reviewed: false,
  },
]
