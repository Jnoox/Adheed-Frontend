import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import type { Contradiction } from '@/schemas'

type ContradictionReview = {
  id: string
  reviewed: boolean
}

export function useUpdateContradiction(caseId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['contradictions', caseId] as const

  return useMutation({
    mutationFn: (input: ContradictionReview) =>
      api.updateContradiction(caseId, input.id, { reviewed: input.reviewed }),
    onMutate: async (input) => {
      const previous = queryClient.getQueryData<Contradiction[]>(queryKey)
      queryClient.setQueryData<Contradiction[]>(queryKey, (current) =>
        current?.map((item) =>
          item.id === input.id ? { ...item, reviewed: input.reviewed } : item,
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
