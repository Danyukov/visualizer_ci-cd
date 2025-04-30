import { useContext } from 'react'
import { UserContext } from './context'

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within an UserProvider')
  }
  return ctx
}
