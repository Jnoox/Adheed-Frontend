import { cases, dashboardAlerts, evidence } from '@/mocks/data'
import { dashboardSchema } from '@/schemas'

const weekMs = 7 * 24 * 60 * 60 * 1000

export async function getDashboard() {
  const now = Date.now()
  const rows = cases.map((item) => ({
    ...item,
    evidenceCount: evidence.filter((entry) => entry.caseId === item.id).length,
    alertCount: dashboardAlerts.filter((entry) => entry.caseId === item.id).length,
  }))

  return dashboardSchema.parse({
    alerts: dashboardAlerts,
    cases: rows,
    stats: {
      activeCases: rows.filter((item) => item.status === 'active').length,
      openedThisWeek: rows.filter(
        (item) => now - new Date(item.createdAt).getTime() <= weekMs,
      ).length,
      newAlerts: dashboardAlerts.length,
      totalEvidence: rows.reduce((sum, item) => sum + item.evidenceCount, 0),
      pendingReview: evidence.filter((item) => item.status !== 'analysed').length,
    },
  })
}
