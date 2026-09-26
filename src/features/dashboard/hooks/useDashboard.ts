import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  })
}
