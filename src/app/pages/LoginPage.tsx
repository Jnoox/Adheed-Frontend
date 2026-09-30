import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { realApi } from '@/api/client'
import { useT } from '@/app/LanguageProvider'

export default function LoginPage() {
  const navigate = useNavigate()
  const { t, toggleLanguage, language } = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { token } = await realApi.login({ email, password })
      localStorage.setItem('auth_token', token)
      navigate('/')
    } catch (err) {
      setError(t('auth.loginError'))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 relative">
      <div className="absolute top-4 end-4">
        <Button variant="ghost" onClick={toggleLanguage}>
          {t('common.languageToggle')}
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h1 className="mb-6 text-center font-display text-2xl font-bold text-text">{t('auth.loginTitle')}</h1>
          {error && <div className="mb-4 text-center text-sm text-red-500">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <TextField
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="mt-4 w-full">{t('auth.loginButton')}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-muted">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="text-accent underline">{t('auth.signupLink')}</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

