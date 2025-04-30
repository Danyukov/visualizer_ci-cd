import { useContext } from 'react'
import { DashboardContext } from './context'

export const useDashboard = () => {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return ctx
}
