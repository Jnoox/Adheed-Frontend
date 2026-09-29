import { suggestions } from '@/mocks/data'
import { suggestionListSchema, suggestionSchema } from '@/schemas'

export async function listSuggestions(caseId: string) {
  return suggestionListSchema.parse(
    suggestions.filter((item) => item.caseId === caseId),
  )
}

export async function updateSuggestion(
  caseId: string,
  suggestionId: string,
  input: { status: 'accepted' | 'rejected' },
) {
  const item = suggestions.find(
    (suggestion) => suggestion.id === suggestionId && suggestion.caseId === caseId,
  )
  if (!item) throw new Error('Suggestion not found')
  if (input.status !== 'accepted' && input.status !== 'rejected') {
    throw new Error('Suggestion status must be accepted or rejected')
  }
  item.status = input.status
  return suggestionSchema.parse(item)
}
