# عضيد (Adheed)

الحقيقة لا تُرى، بل تُستدل.
Truth is not seen, it is deduced.

Frontend by Jana Sandeyouni.

## ما هذا / What this is

منصة تحقيق بمساعدة الذكاء الاصطناعي. يفتح المحقق قضية، يضيف الأدلة، ويربطها النظام بالأشخاص والأماكن والأوقات، ويبني خطاً زمنياً وشبكة علاقات، وينبّه إلى التناقضات والفجوات، ويقترح تسلسلات محتملة للأحداث.

المبدأ: النظام يشرح استدلاله، والمحقق يتخذ القرار النهائي. لا يصدر اتهاماً ولا حكماً.

An AI-assisted investigation platform. An investigator opens a case, adds evidence, and the system links it to people, places and times, builds a timeline and a relationship network, flags contradictions and gaps, and suggests possible event sequences.

The system explains its reasoning. The investigator always makes the final decision. It never produces an accusation or a verdict.

## السياق / Context

نموذج أولي لمسابقة (MVP). يعمل على بيانات تجريبية مختلقة. ليس نظاماً إنتاجياً، والشاشات الحالية عناصر نائبة إلا ما يُذكر صراحة أدناه.

A competition MVP prototype. It runs on fictional seed data. It is not a production system. Do not treat placeholder screens as finished features.

## هذا المستودع / This repository

الواجهة الأمامية فقط. الواجهة الخلفية مستودع منفصل لم يُربط بعد.

Frontend only. No backend is linked from this repository.

## التقنيات / Stack

- **Vite** — تشغيل وبناء سريعان أثناء التطوير.
- **React** — واجهة المكوّنات.
- **TypeScript** — أنواع على العقود والواجهات.
- **React Router** — التوجيه في مكان واحد.
- **TanStack Query** — جلب الحالة البعيدة لاحقاً دون أن تجلب المكوّنات بنفسها.
- **Zod** — التحقق من شكل كل استجابة قبل استخدامها.
- **Tailwind CSS v4** — تنسيق عبر رموز دلالية قابلة للاستبدال.
- **Vitest** — اختبار المخططات والتوجيه وطبقة المحاكاة.

## قرارات معمارية / Architecture

- **RTL أولاً.** `dir="rtl"` وخصائص CSS المنطقية. لا `left`/`right` ولا `pl`/`pr`.
  RTL-first with CSS logical properties.
- **رموز التصميم على طبقتين.** الهوية المؤقتة في `src/styles/tokens.css` فقط. عند وصول التصميم النهائي يتغيّر هذا الملف دون لمس المكوّنات.
  Two-layer tokens: the final identity swaps in one file.
- **بيانات وهمية خلف مفتاح واحد.** `VITE_USE_MOCKS` (الافتراضي `true`). الربط بالخادم تغيير إعداد لا إعادة كتابة.
  Mock layer behind one config flag.
- **Zod على كل استجابة.** اختلاف العقد يظهر كفشل صريح لا كواجهة صامتة.
  Schema validation so payload drift fails loudly.
- **العربية هي الواجهة الافتراضية، والإنجليزية اختيار ثانٍ.** نصوص الواجهة في `src/i18n/`، والاختيار يُحفظ في المتصفح ويضبط `dir` و`lang` والخط. أسماء القضايا والأدلة والأشخاص تبقى عربية لأنها محتوى.
  Arabic is the default interface, English is a second choice. Interface copy lives in `src/i18n`. The choice is stored in the browser and sets direction, language, and font. Case names, evidence, people, and descriptions stay Arabic because they are content.

## التشغيل / Getting started

```bash
npm install
npm run dev
```

```bash
npm run test:run
npm run build
```

النسخ من `.env.example` إلى `.env.local` اختياري. المحاكاة تعمل ما دام `VITE_USE_MOCKS` ليس `false`.

Copy `.env.example` to `.env.local` if you want the flags explicit. Mocks stay on until `VITE_USE_MOCKS=false`.

## البنية / Structure

```
src/
  app/           # الغلاف، التوجيه، التخطيطات، المزودات
  features/      # مجلد لكل مجال — لا استيراد بين المجالات
  components/    # مكوّنات مشتركة وتخطيط
  api/           # العميل، المسارات، مفتاح المحاكاة/الإنتاج
  mocks/         # بيانات البذرة ومعالجات المحاكاة
  schemas/       # مخططات Zod والأنواع المستنتجة
  i18n/          # نصوص الواجهة بالعربية والإنجليزية
  lib/           # أدوات مساعدة (cn، وقت، RTL)
  config/        # البيئة والأعلام
  styles/        # الرموز وCSS العام
```

## الحالة / Status

| Built | Placeholder |
| --- | --- |
| Routing, RTL shell, design tokens, UI primitives | Cases list |
| Zod schemas and mock API switch | Case file view |
| Seed case `23-4587` (fictional) | Evidence detail |
| Dashboard | In-case search |
| Case intake | 2D crime scene |
| Evidence list | Reports and settings |
| Timeline and sequence | |
| Relationship network | |
| Investigation room | |
| Analysis | |
| Activity log | |

## الفريق / Team

- Nada — product lead
- Jana Sandeyouni — Frontend (this repository) — [github.com/Jnoox](https://github.com/Jnoox)
- Ali — Backend
- Sumaya — UX/UI
