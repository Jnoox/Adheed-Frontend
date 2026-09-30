import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { controlFocus } from './control'

type TabTone = 'default' | 'onAccent'

const tabClass = {
  default: {
    active: 'bg-accent text-accent-text',
    idle: 'border border-border bg-surface-raised text-text-muted hover:border-accent hover:text-text',
  },
  onAccent: {
    active: 'border border-surface-raised bg-surface-raised text-accent',
    idle: 'border border-text-inverse-muted bg-transparent text-text-inverse hover:border-accent-text',
  },
} satisfies Record<TabTone, { active: string; idle: string }>

function tabClasses(active: boolean, tone: TabTone) {
  return cn(
    'inline-flex min-h-10 items-center rounded-full px-4 text-body',
    controlFocus,
    active ? tabClass[tone].active : tabClass[tone].idle,
  )
}

type TabLinkProps = {
  to: string
  end?: boolean
  children: ReactNode
}

export function TabLink({ to, end = false, children }: TabLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => tabClasses(isActive, 'default')}
    >
      {children}
    </NavLink>
  )
}

type TabButtonProps = {
  selected: boolean
  tone?: TabTone
  children: ReactNode
  onSelect: () => void
}

export function TabButton({
  selected,
  tone = 'default',
  children,
  onSelect,
}: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={tabClasses(selected, tone)}
      onClick={onSelect}
    >
      {children}
    </button>
  )
}

type TabListProps = {
  label: string
  children: ReactNode
}

export function TabList({ label, children }: TabListProps) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {children}
    </div>
  )
}
