import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { realApi } from '@/api/client'
import { useT } from '@/app/LanguageProvider'

export default function SignupPage() {
  const navigate = useNavigate()
  const { t, toggleLanguage } = useT()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { token } = await realApi.signup({ name, email, password, role: 'investigator' })
      localStorage.setItem('auth_token', token)
      navigate('/')
    } catch (err) {
      setError(t('auth.signupError'))
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
          <h1 className="mb-6 text-center font-display text-2xl font-bold text-text">{t('auth.signupTitle')}</h1>
          {error && <div className="mb-4 text-center text-sm text-red-500">{error}</div>}
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <TextField
              label={t('auth.name')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <Button type="submit" className="mt-4 w-full">{t('auth.signupButton')}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-muted">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-accent underline">{t('auth.loginLink')}</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

