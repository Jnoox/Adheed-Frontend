import { env } from '@/config/env'
import { realApi } from './client'
import { mockApi } from '@/mocks/handlers'
import type { AdheedApi } from './types'

export { ApiError, request } from './client'
export { endpoints } from './endpoints'
export type { AdheedApi } from './types'

export const api: AdheedApi = env.USE_MOCKS ? mockApi : realApi
