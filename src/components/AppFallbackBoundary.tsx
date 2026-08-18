import type { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { RouteError } from './AppFallback'

interface AppFallbackBoundaryProps {
  children: ReactNode
}

export function AppFallbackBoundary({ children }: AppFallbackBoundaryProps) {
  return (
    <ErrorBoundary fallback={(retry) => <RouteError onRetry={retry} />}>
      {children}
    </ErrorBoundary>
  )
}
