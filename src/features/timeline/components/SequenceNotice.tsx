import sequenceNoticeIcon from '@/assets/sequence-notice.svg'
import { useT } from '@/app/LanguageProvider'

export function SequenceNotice() {
  const { t } = useT()
  return (
    <div className="flex items-center justify-center gap-2 rounded-md border border-dashed border-warning-border bg-warning-surface px-page py-3 text-caption text-warning-text">
      <img src={sequenceNoticeIcon} alt="" width={21} height={20} />
      <p>{t('timeline.notice')}</p>
    </div>
  )
}
