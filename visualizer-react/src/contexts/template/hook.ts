import { useContext } from 'react'
import { TemplateContext } from './context'

export const useTemplate = () => {
  const ctx = useContext(TemplateContext)
  if (!ctx) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }
  return ctx
}
