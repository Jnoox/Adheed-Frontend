import { adaptList, identity, type Adapter } from './shared'

/**
 * `relationType` (e.g. `seen_in`) is a code, not an explanation, so it is never
 * copied into `reason`. The backend now sends `reason` and `evidenceIds`;
 * `relationType` passes through and Zod strips it.
 */
export const adaptRelation: Adapter = identity

export const adaptRelationList = adaptList(adaptRelation)
