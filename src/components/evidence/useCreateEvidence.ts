import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import type { CreateEvidenceInput } from '@/schemas'

export function useCreateEvidence(caseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEvidenceInput) =>
      api.createEvidence(caseId, input),
    onSuccess: async () => {
      await Promise.all(
        [
          'evidence',
          'sequences',
          'gaps',
          'contradictions',
          'relations',
          'people',
          'places',
          'events',
          'audit',
        ].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key, caseId] }),
        ),
      )
    },
  })
}
