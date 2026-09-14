import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { CaseLayout } from '@/app/layouts/CaseLayout'
import { RootLayout } from '@/app/layouts/RootLayout'
import NotFoundPage from '@/app/pages/NotFoundPage'
import ActivityLogPage from '@/features/audit/pages/ActivityLogPage'
import CaseFilePage from '@/features/cases/pages/CaseFilePage'
import CasesListPage from '@/features/cases/pages/CasesListPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import EvidenceDetailPage from '@/features/evidence/pages/EvidenceDetailPage'
import EvidenceListPage from '@/features/evidence/pages/EvidenceListPage'
import InvestigationRoomPage from '@/features/investigation-room/pages/InvestigationRoomPage'
import NetworkPage from '@/features/network/pages/NetworkPage'
import ScenePage from '@/features/scene/pages/ScenePage'
import TimelinePage from '@/features/timeline/pages/TimelinePage'

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'cases', element: <CasesListPage /> },
      {
        path: 'cases/:caseId',
        element: <CaseLayout />,
        children: [
          { index: true, element: <CaseFilePage /> },
          { path: 'evidence', element: <EvidenceListPage /> },
          { path: 'evidence/:evidenceId', element: <EvidenceDetailPage /> },
          { path: 'network', element: <NetworkPage /> },
          { path: 'timeline', element: <TimelinePage /> },
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
