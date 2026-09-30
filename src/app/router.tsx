import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import LoginPage from '@/app/pages/LoginPage'
import SignupPage from '@/app/pages/SignupPage'
import { CaseLayout } from '@/app/layouts/CaseLayout'
import { RootLayout } from '@/app/layouts/RootLayout'
import NotFoundPage from '@/app/pages/NotFoundPage'
import ReportPage from '@/features/reports/pages/ReportPage'
import SettingsPage from '@/app/pages/SettingsPage'
import AnalysisPage from '@/features/analysis/pages/AnalysisPage'
import ActivityLogPage from '@/features/audit/pages/ActivityLogPage'
import CaseFilePage from '@/features/cases/pages/CaseFilePage'
import CasesListPage from '@/features/cases/pages/CasesListPage'
import CreateCasePage from '@/features/cases/pages/CreateCasePage'
import EditCasePage from '@/features/cases/pages/EditCasePage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import EvidenceDetailPage from '@/features/evidence/pages/EvidenceDetailPage'
import EvidenceListPage from '@/features/evidence/pages/EvidenceListPage'
import InvestigationRoomPage from '@/features/investigation-room/pages/InvestigationRoomPage'
import NetworkPage from '@/features/network/pages/NetworkPage'
import ScenePage from '@/features/scene/pages/ScenePage'
import TimelinePage from '@/features/timeline/pages/TimelinePage'

export const appRoutes: RouteObject[] = [
  {
    path: '/cases/new',
    element: <CreateCasePage />,
  },
  {
    path: '/cases/:caseId/edit',
    element: <EditCasePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'cases', element: <CasesListPage /> },
      { path: 'reports', element: <ReportPage /> },
      { path: 'settings', element: <SettingsPage /> },
      {
        path: 'cases/:caseId',
        element: <CaseLayout />,
        children: [
          { index: true, element: <CaseFilePage /> },
          { path: 'evidence', element: <EvidenceListPage /> },
          { path: 'evidence/:evidenceId', element: <EvidenceDetailPage /> },
          { path: 'network', element: <NetworkPage /> },
          { path: 'timeline', element: <TimelinePage /> },
          { path: 'analysis', element: <AnalysisPage /> },
          { path: 'scene', element: <ScenePage /> },
          { path: 'room', element: <InvestigationRoomPage /> },
          { path: 'log', element: <ActivityLogPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
