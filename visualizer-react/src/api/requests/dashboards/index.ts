import { $api } from '@/api/axios'
import { Canvas } from '@/models/canvas'
import { Dashboard, DashboardUpdateSchema } from '@/models/dashboard'
import { Template } from '@/models/template'
import { User } from '@/models/user'

export type PostCreateDashboardParams = {
  name: string
  canvases?: Canvas[]
  templateId?: Template['id']
  userId: User['id']
}
export type PostCreateDashboardConfig = AxiosRequestConfig<PostCreateDashboardParams>

export const postCreateDashboard = async ({ params, config }: PostCreateDashboardConfig) =>
  $api.post<ApiResponse<string>>('/visualizations', params, config)

export type GetDashboardsConfig = AxiosRequestConfig

export const getDashboards = async ({ config }: GetDashboardsConfig) =>
  $api.get<ApiResponse<Dashboard[]>>('/visualizations', config)

export type GetDashboardByIdParams = { dashboardId: string }
export type GetDashbaordByIdConfig = AxiosRequestConfig<GetDashboardByIdParams>

export const getDashboardById = async ({ params, config }: GetDashbaordByIdConfig) =>
  $api.get<ApiResponse<Dashboard>>(`/visualizations/${params.dashboardId}`, config)

export type GetDashboardsByTemplateIdParams = { templateId: string }
export type GetDashboardsByTemplateIdConfig = AxiosRequestConfig<GetDashboardsByTemplateIdParams>

export const getDashboardsByTemplateId = async ({
  params,
  config,
}: GetDashboardsByTemplateIdConfig) =>
  $api.get<ApiResponse<Dashboard[]>>(`/visualizations/t/${params.templateId}`, config)

export type GetDashboardsByShareIdParams = { shareId: string }
export type GetDashboardsByShareIdConfig = AxiosRequestConfig<GetDashboardsByShareIdParams>

export const getDashboardByShareId = async ({ params, config }: GetDashboardsByShareIdConfig) =>
  $api.get<ApiResponse<Dashboard>>(`/visualizations/share/${params.shareId}`, config)

export type PatchEditDashboardParams = { dashboardId: string; data: DashboardUpdateSchema }
export type PatchEditDashboardConfig = AxiosRequestConfig<PatchEditDashboardParams>

export const patchEditDashboard = async ({ params, config }: PatchEditDashboardConfig) =>
  $api.patch<ApiResponse>(`/visualizations/${params.dashboardId}`, params.data, config)

export type DeleteDashboardParams = { dashboardId: string }
export type DeleteDashboardConfig = AxiosRequestConfig<DeleteDashboardParams>

export const deleteDashboard = async ({ params, config }: DeleteDashboardConfig) =>
  $api.delete<ApiResponse>(`/visualizations/${params.dashboardId}`, config)
