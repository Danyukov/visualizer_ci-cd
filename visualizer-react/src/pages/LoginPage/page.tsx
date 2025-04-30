import { Navigate } from 'react-router'

import { LoginForm } from '@/components/forms/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { useUser } from '@/contexts/user/hook'

export default function LoginPage() {
  const { user } = useUser()

  if (user) {
    return <Navigate to='/' replace />
  }

  return (
    <>
      <header>
        <h1 className='text-sm font-medium p-5'>Imby / Visualizer</h1>
      </header>
      <div className='flex flex-col justify-center items-center w-full h-full mt-64'>
        <div className='max-w-[420px] w-full space-y-4'>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle className='font-medium text-lg'>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
