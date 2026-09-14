import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

const items = [
  { to: '/', label: 'لوحة التحكم', end: true },
  { to: '/cases', label: 'القضايا', end: false },
]

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-stack border-e border-border bg-surface-raised p-inline">
      <p className="px-inline pt-stack text-title">عضيد</p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'rounded-md px-inline py-2 text-body',
                isActive
                  ? 'bg-surface text-accent'
                  : 'text-text-muted hover:bg-surface hover:text-text',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
