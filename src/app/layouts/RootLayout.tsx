import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'

export function RootLayout() {
  return (
    <div className="flex min-h-svh bg-surface text-text">
      <Sidebar />
      <main className="min-w-0 flex-1 p-page">
        <Outlet />
      </main>
    </div>
  )
}
