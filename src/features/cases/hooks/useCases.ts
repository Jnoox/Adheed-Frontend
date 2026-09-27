import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: () => api.listCases(),
  })
}

export function useCaseAlertCounts() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
    select: (dashboard) =>
      Object.fromEntries(dashboard.cases.map((item) => [item.id, item.alertCount])),
  })
}
