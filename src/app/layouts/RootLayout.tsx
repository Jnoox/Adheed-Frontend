import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-surface text-text">
      <Topbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 p-page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
