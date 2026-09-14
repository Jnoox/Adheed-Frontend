import { suggestions } from '@/mocks/data'
import { suggestionListSchema } from '@/schemas'

export async function listSuggestions(caseId: string) {
  return suggestionListSchema.parse(
    suggestions.filter((item) => item.caseId === caseId),
  )
}
