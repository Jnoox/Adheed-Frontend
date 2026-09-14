import { places } from '@/mocks/data'
import { placeListSchema } from '@/schemas'

export async function listPlaces(caseId: string) {
  return placeListSchema.parse(places.filter((item) => item.caseId === caseId))
}
