// import { scan } from 'react-scan'
import * as Sentry from '@sentry/react'
import {
  // MutationCache, QueryCache,
  QueryClient,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import '@/shared/css/index.css'
import {
  // toast,
  Toaster,
} from 'sonner'
import { zEnv } from './shared/constants/environment'
import { router } from './router'
// import { AxiosError } from 'axios'
import { LOCAL_STORAGE_KEYS } from './shared/constants/storageKeys'
import { Providers, ProvidersProps } from './providers'
import { getUserById } from './api/requests/users'

Sentry.init({
  dsn: zEnv.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  // Capture 100% of the transactions
  tracesSampleRate: 1.0,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0,
  environment: zEnv.MODE,
})

// if (typeof window !== 'undefined') {
//   scan({
//     enabled: true,
//     log: true,
//   })
// }

const main = async () => {
  const container = document.getElementById('root')

  if (!container) {
    throw new Error('could not find root element')
  }

  const root = createRoot(container)

  // const DEFAULT_ERROR = 'Something went wrong'

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchInterval: 0,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retryOnMount: false,
      },
    },
    // queryCache: new QueryCache({
    //   onError: (error) => {
    //     const { response } = error as AxiosError<{ message: string }>
    //     toast.error(response?.data.message ?? DEFAULT_ERROR)
    //   },
    // }),
    // mutationCache: new MutationCache({
    //   onError: (error) => {
    //     const { response } = error as AxiosError<{ message: string }>
    //     toast.error(response?.data.message ?? DEFAULT_ERROR)
    //   },
    // }),
  })

  // const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const hardTimeZone = 'Europe/Brussels'

  const providerProps: Omit<ProvidersProps, 'children'> = {
    query: { client: queryClient },
    user: {
      initialValue: {
        user: undefined,
        timeZone: hardTimeZone,
      },
    },
  }

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID)

  if (token && userId) {
    const getUserQuery = await queryClient.fetchQuery({
      queryKey: [],
      queryFn: () => getUserById({ params: { userId } }),
    })

    providerProps.user.initialValue.user = getUserQuery.data.data
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_ID)
    providerProps.user.initialValue.user = null
  }

  root.render(
    <StrictMode>
      <Providers {...providerProps}>
        <RouterProvider router={router} />
        <Toaster richColors position='top-center' />
        {zEnv.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </Providers>
    </StrictMode>
  )
}

main()
