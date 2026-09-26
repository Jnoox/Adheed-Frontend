import { z } from 'zod'
import { caseSchema } from './case'

export const dashboardAlertSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  message: z.string().min(1),
})
export type DashboardAlert = z.infer<typeof dashboardAlertSchema>

export const dashboardCaseSchema = caseSchema.extend({
  evidenceCount: z.number().min(0),
  alertCount: z.number().min(0),
})
export type DashboardCase = z.infer<typeof dashboardCaseSchema>

export const dashboardStatsSchema = z.object({
  activeCases: z.number().min(0),
  openedThisWeek: z.number().min(0),
  newAlerts: z.number().min(0),
  totalEvidence: z.number().min(0),
  pendingReview: z.number().min(0),
})
export type DashboardStats = z.infer<typeof dashboardStatsSchema>

export const dashboardSchema = z.object({
  alerts: z.array(dashboardAlertSchema),
  cases: z.array(dashboardCaseSchema),
  stats: dashboardStatsSchema,
})
export type Dashboard = z.infer<typeof dashboardSchema>
