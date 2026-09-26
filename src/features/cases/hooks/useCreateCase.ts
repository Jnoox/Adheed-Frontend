import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import type { CreateCaseInput } from '@/schemas'

export function useCreateCase() {
  return useMutation({
    mutationFn: (input: CreateCaseInput) => api.createCase(input),
  })
}
