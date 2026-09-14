import { NavLink, Outlet, useParams } from 'react-router-dom'
import { cn } from '@/lib/cn'

const tabs = [
  { to: '', label: 'ملف القضية' },
  { to: 'evidence', label: 'الأدلة' },
  { to: 'network', label: 'الشبكة' },
  { to: 'timeline', label: 'الخط الزمني' },
  { to: 'scene', label: 'مسرح الجريمة' },
  { to: 'room', label: 'غرفة التحقيق' },
  { to: 'log', label: 'السجل' },
]

export function CaseLayout() {
  const { caseId } = useParams()
  const base = `/cases/${caseId ?? ''}`

  return (
    <div className="flex min-h-full flex-col">
      <nav className="flex flex-wrap gap-1 border-b border-border px-page py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to === '' ? base : `${base}/${tab.to}`}
            end={tab.to === ''}
            className={({ isActive }) =>
              cn(
                'rounded-md px-inline py-2 text-body',
                isActive
                  ? 'bg-surface-raised text-accent'
                  : 'text-text-muted hover:text-text',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
