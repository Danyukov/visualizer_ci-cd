import { lazy } from 'react'
// login
export const LoginPage = lazy(() => import('./LoginPage/page'))
// home
export const HomePage = lazy(() => import('./HomePage/page'))
// templates
export const TemplateEditPage = lazy(() => import('./TemplateEditPage/page'))
// visualizations
export const DashboardEditPage = lazy(() => import('./DashboardEditPage/page'))
// analyze
export const AnalyzePage = lazy(() => import('./AnalysisPage/page'))
// preview
export const PreviewPage = lazy(() => import('./PreviewPage/page'))
