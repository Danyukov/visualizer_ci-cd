import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { usePostLoginUserMutation } from '@/api/hooks/users'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { toast } from 'sonner'
import { LOCAL_STORAGE_KEYS } from '@/shared/constants/storageKeys'
import { useNavigate } from 'react-router'
import { useUser } from '@/contexts/user/hook'

const loginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type UserLoginFormSchemaType = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const form = useForm<UserLoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { setUser } = useUser()
  const navigate = useNavigate()

  // TODO: доработать сообщения ответов и использовать их в качестве сообщений пользователям
  const postLoginUserMutation = usePostLoginUserMutation({
    options: {
      onSuccess: ({ data: { data } }) => {
        if (data) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.token)
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, data.user.id)
          setUser(data.user)

          toast.success('You are logged in 👍', {
            description: 'We are very glad to see you, have fun',
          })

          navigate('/')
        }
      },
      onError: () => {
        toast.error('Failed to log in')
      },
    },
  })

  async function onSubmit(values: UserLoginFormSchemaType) {
    if (!values) return
    await postLoginUserMutation.mutateAsync({ params: values })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='space-y-0.5'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='Password' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' type='submit'>
          Login
        </Button>
      </form>
    </Form>
  )
}
