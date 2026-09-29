import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import type { Case, CreateCaseInput, UpdateCaseInput } from '@/schemas'

export function caseChanges(input: CreateCaseInput): UpdateCaseInput {
  return {
    caseType: input.caseType,
    reportedAt: input.reportedAt,
    location: input.location,
    description: input.description,
    reportingAuthority: input.reportingAuthority,
    investigator: input.investigator,
    status: input.status,
  }
}

export function useUpdateCase(caseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCaseInput) => api.updateCase(caseId, caseChanges(input)),
    onSuccess: (updated) => {
      queryClient.setQueryData(['case', caseId], updated)
      queryClient.setQueryData<Case[]>(['cases'], (current) =>
        current?.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      )
    },
  })
}
