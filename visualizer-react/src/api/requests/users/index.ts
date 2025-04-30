import { $api } from '@/api/axios'
import { UserLoginFormSchemaType } from '@/components/forms/LoginForm'
import { User, UserLoginResponse } from '@/models/user'

export type GetUserByIdParams = { userId: string }
export type GetUserByIdConfig = AxiosRequestConfig<GetUserByIdParams>

export const getUserById = async ({ params, config }: GetUserByIdConfig) =>
  $api.get<ApiResponse<User>>(`/users/${params.userId}`, config)

export type PostLoginUserParams = UserLoginFormSchemaType
export type PostLoginUserConfig = AxiosRequestConfig<PostLoginUserParams>

export const postLoginUser = async ({ params, config }: PostLoginUserConfig) =>
  $api.post<ApiResponse<UserLoginResponse>>('/auth/login', params, config)
