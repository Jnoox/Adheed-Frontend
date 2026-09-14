import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ open, title, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-page">
      <button
        type="button"
        className="absolute inset-0 bg-surface/80"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-border bg-surface-overlay p-page',
          className,
        )}
      >
        <div className="mb-stack flex items-center justify-between gap-inline">
          <h2 id="modal-title" className="text-title">
            {title}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            إغلاق
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
