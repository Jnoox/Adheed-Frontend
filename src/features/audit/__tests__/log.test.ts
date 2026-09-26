import { presentEntry } from '@/features/audit/log'
import type { AuditEntry } from '@/schemas'

function entry(action: AuditEntry['action']): AuditEntry {
  return {
    id: action,
    caseId: 'case-234587',
    action,
    actor: 'محقق تجريبي',
    occurredAt: '2026-03-12T18:00:00.000Z',
    details: 'تفاصيل',
  }
}

describe('audit entry chips', () => {
  it('maps an entry type to its chip label and colour', () => {
    const complete = presentEntry(entry('evidence.added')).chip
    const system = presentEntry(entry('sequence.updated')).chip
    const pending = presentEntry(entry('contradiction.detected')).chip

    expect(complete.label).toBe('مكتمل')
    expect(complete.chipClass).toContain('text-confirmed')
    expect(complete.dotClass).toBe('bg-confirmed')

    expect(system.label).toBe('نظام')
    expect(system.chipClass).toContain('text-accent')
    expect(system.dotClass).toBe('bg-accent')

    expect(pending.label).toBe('بانتظار مراجعة')
    expect(pending.chipClass).toContain('text-warning')
    expect(pending.dotClass).toBe('bg-warning')
  })
})
