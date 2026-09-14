import { api } from '@/api'
import { env } from '@/config/env'

describe('mock API switch', () => {
  it('uses mocks by default and returns the seed case', async () => {
    expect(env.USE_MOCKS).toBe(true)

    const cases = await api.listCases()

    expect(cases).toHaveLength(1)
    expect(cases[0]?.caseNumber).toBe('23-4587')
  })
})
