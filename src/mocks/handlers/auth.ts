export async function login(credentials: { email?: string; password?: string }) {
  return {
    token: 'mock-token',
    user: {
      email: credentials?.email ?? 'investigator@adheed.local',
      name: 'محقق تجريبي',
      role: 'investigator',
    },
  }
}

export async function signup(userData: {
  email?: string
  name?: string
  role?: string
  password?: string
}) {
  return {
    token: 'mock-token',
    user: {
      email: userData?.email ?? 'investigator@adheed.local',
      name: userData?.name ?? 'محقق تجريبي',
      role: userData?.role ?? 'investigator',
    },
  }
}
