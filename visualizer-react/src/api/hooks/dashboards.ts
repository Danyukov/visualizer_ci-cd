import { useMutation, useQuery } from '@tanstack/react-query'
import {
  deleteDashboard,
  DeleteDashboardConfig,
  getDashboardById,
  GetDashboardByIdParams,
  getDashboardByShareId,
  getDashboards,
  GetDashboardsByShareIdParams,
  getDashboardsByTemplateId,
  GetDashboardsByTemplateIdParams,
  patchEditDashboard,
  PatchEditDashboardConfig,
  postCreateDashboard,
  PostCreateDashboardConfig,
} from '../requests/dashboards'
import { queryKeys } from '@/shared/constants/queryKeys'

export const useGetDashboardsQuery = (settings?: QuerySettings<typeof getDashboards>) => {
  return useQuery({
    queryKey: [queryKeys.GET_DASHBOARDS],
    queryFn: () => getDashboards({ config: settings?.config }),
    ...settings?.options,
  })
}

export const useGetDashboardByIdQuery = (
  params: GetDashboardByIdParams,
  settings?: QuerySettings<typeof getDashboardById>
) => {
  return useQuery({
    queryKey: [queryKeys.GET_DASHBOARD_BY_ID, params.dashboardId],
    queryFn: () => getDashboardById({ params, config: settings?.config }),
    ...settings?.options,
  })
}

export const useGetDashboardByShareId = (
  params: GetDashboardsByShareIdParams,
  settings?: QuerySettings<typeof getDashboardByShareId>
) => {
  return useQuery({
    queryKey: [queryKeys.GET_DASHBOARD_BY_SHARE_ID, params.shareId],
    queryFn: () => getDashboardByShareId({ params, config: settings?.config }),
    ...settings?.options,
  })
}

export const useGetDashboardsByTemplateIdQuery = (
  params: GetDashboardsByTemplateIdParams,
  settings?: QuerySettings<typeof getDashboardsByTemplateId>
) => {
  return useQuery({
    queryKey: [queryKeys.GET_DASHBOARDS_BY_TEMPLATE_ID, params.templateId],
    queryFn: () => getDashboardsByTemplateId({ params, config: settings?.config }),
    ...settings?.options,
  })
}

export const usePostDashboardMutation = (
  settings?: MutationSettings<PostCreateDashboardConfig, typeof postCreateDashboard>
) => {
  return useMutation({
    mutationKey: [],
    mutationFn: ({ params, config }) =>
      postCreateDashboard({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  })
}

export const usePatchEditDashboardMutation = (
  settings?: MutationSettings<PatchEditDashboardConfig, typeof patchEditDashboard>
) => {
  return useMutation({
    mutationKey: [],
    mutationFn: ({ params, config }) =>
      patchEditDashboard({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  })
}

export const useDeleteDashboardMutation = (
  settings?: MutationSettings<DeleteDashboardConfig, typeof deleteDashboard>
) => {
  return useMutation({
    mutationKey: [],
    mutationFn: ({ params, config }) =>
      deleteDashboard({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  })
}
