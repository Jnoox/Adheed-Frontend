import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import type { Suggestion } from '@/schemas'

type SuggestionDecision = {
  id: string
  status: 'accepted' | 'rejected'
}

export function useUpdateSuggestion(caseId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['suggestions', caseId] as const

  return useMutation({
    mutationFn: (input: SuggestionDecision) =>
      api.updateSuggestion(caseId, input.id, { status: input.status }),
    onMutate: async (input) => {
      const previous = queryClient.getQueryData<Suggestion[]>(queryKey)
      queryClient.setQueryData<Suggestion[]>(queryKey, (current) =>
        current?.map((item) =>
          item.id === input.id ? { ...item, status: input.status } : item,
        ),
      )
      await queryClient.cancelQueries({ queryKey })
      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey })
    },
  })
}
