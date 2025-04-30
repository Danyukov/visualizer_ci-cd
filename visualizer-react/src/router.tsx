import { createBrowserRouter, Navigate } from 'react-router'
import { MainLayout } from './components/layouts/MainLayout'
import {
  AnalyzePage,
  DashboardEditPage,
  HomePage,
  LoginPage,
  PreviewPage,
  TemplateEditPage,
} from './pages'
import { RootErrorBoundary } from './pages/RootErrorBoundary'
import { UserRole } from './models/user'
import { ReactNode } from 'react'
import { Loader } from './components/Loader'
import { useUser } from './contexts/user/hook'
import { DashboardProvider } from './contexts/dashboard/provider'
import { AnalysisProvider } from './contexts/analysis/provider'
import { TemplateProvider } from './contexts/template/provider'

type ProtectedRouteProps = {
  allowedRoles: UserRole[]
  children: ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useUser()

  if (user === undefined) {
    return <Loader />
  }

  if (user === null) {
    return <Navigate to='/login' replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return children
}

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        id: 'main',
        element: <ProtectedRoute allowedRoles={['Admin']} children={<MainLayout />} />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: '/analysis',
            element: <AnalysisProvider children={<AnalyzePage />} />,
          },
          {
            path: '/templates/:templateId',
            element: <TemplateProvider children={<TemplateEditPage />} />,
          },
          {
            path: '/dashboards/:dashboardId',
            element: <DashboardProvider children={<DashboardEditPage />} />,
          },
        ],
      },
      {
        path: '/preview/:shareId',
        element: <PreviewPage />,
      },
      {
        path: '*',
        element: <Navigate to='/' replace />,
      },
    ],
  },
])
