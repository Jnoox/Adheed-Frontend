import { CASE_ID } from './cases'

export const people = [
  {
    id: 'person-01',
    caseId: CASE_ID,
    name: 'أحمد الشمري',
    role: 'victim' as const,
    notes: 'صاحب محل النجمة للمجوهرات. وصل بعد البلاغ ووجد الواجهة مكسورة.',
  },
  {
    id: 'person-02',
    caseId: CASE_ID,
    name: 'نورة العتيبي',
    role: 'witness' as const,
    notes: 'كانت تغادر المجمع وسمعت صوت زجاج قرب المحل.',
  },
  {
    id: 'person-03',
    caseId: CASE_ID,
    name: 'فهد القحطاني',
    role: 'suspect' as const,
    notes: 'شوهد في المجمع نهاراً. أدلى بإفادة لا تتوافق مع تسجيل الكاميرا.',
  },
  {
    id: 'person-04',
    caseId: CASE_ID,
    name: 'خالد المطيري',
    role: 'officer' as const,
    notes: 'حارس مجمع الياسمين. وصل إلى الواجهة بعد سماع البلاغ الداخلي.',
  },
]
