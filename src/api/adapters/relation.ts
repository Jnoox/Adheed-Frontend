import { adaptList, identity, type Adapter } from './shared'

/**
 * The backend sends `relationType` (e.g. `seen_in`) and no `reason` or
 * `evidenceIds`. A relation type is a code, not an explanation, so it is NOT
 * turned into a reason. The schema leaves `reason` optional and the UI says
 * the reason is unavailable. `relationType` passes through and Zod strips it.
 */
export const adaptRelation: Adapter = identity

export const adaptRelationList = adaptList(adaptRelation)
