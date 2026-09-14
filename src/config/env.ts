function readFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback
  }

  return value !== 'false' && value !== '0'
}

export const env = {
  USE_MOCKS: readFlag(import.meta.env.VITE_USE_MOCKS, true),
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
} as const
