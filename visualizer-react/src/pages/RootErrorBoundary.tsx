import { Link, useRouteError } from 'react-router'

import { Button } from '@/shared/ui/button'

export function RootErrorBoundary() {
	const error = useRouteError() as Error

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center">
      <div>
        <p className="muted mb-4 mt-1">{error.message}</p>
        <h1 className="h3">Something went wrong...</h1>
        <p className="muted mb-4 mt-1">We're already working on fixing the problem</p>
        <Button variant="secondary" size="sm" asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </section>
  )
}