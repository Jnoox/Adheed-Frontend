import { events } from '@/mocks/data'
import { timeEventListSchema } from '@/schemas'

export async function listEvents(caseId: string) {
  return timeEventListSchema.parse(
    events.filter((item) => item.caseId === caseId),
  )
}
