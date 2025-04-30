import { useMutation } from '@tanstack/react-query'
import { postLoginUser, PostLoginUserConfig } from '../requests/users'

export const usePostLoginUserMutation = (
  settings?: MutationSettings<PostLoginUserConfig, typeof postLoginUser>
) =>
  useMutation({
    mutationFn: ({ params, config }) =>
      postLoginUser({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  })
