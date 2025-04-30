import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getTemplateById,
  GetTemplateByIdParams,
  getTemplates,
  GetTemplatesParams,
  patchEditTemplate,
  PatchEditTemplateConfig,
  postSaveAsTemplate,
  PostSaveAsTemplateConfig,
} from '../requests/templates'
import { queryKeys } from '@/shared/constants/queryKeys'

export const useGetTemplatesQuery = (
  params: GetTemplatesParams,
  settings?: QuerySettings<typeof getTemplates>
) =>
  useQuery({
    queryKey: [queryKeys.GET_TEMPLATES, params.canvases],
    queryFn: () => getTemplates({ params, config: settings?.config }),
    ...settings?.options,
  })

export const useGetTemplateByIdQuery = (
  params: GetTemplateByIdParams,
  settings?: QuerySettings<typeof getTemplateById>
) =>
  useQuery({
    queryKey: [queryKeys.GET_TEMPLATE_BY_ID, params.templateId],
    queryFn: () => getTemplateById({ params, config: settings?.config }),
    ...settings?.config,
  })

export const usePostSaveAsTemplateMutataion = (
  settings?: MutationSettings<PostSaveAsTemplateConfig, typeof postSaveAsTemplate>
) =>
  useMutation({
    mutationKey: [],
    mutationFn: ({ params, config }) =>
      postSaveAsTemplate({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  })

export const usePatchSaveTemplateMutataion = (
  settings?: MutationSettings<PatchEditTemplateConfig, typeof patchEditTemplate>
) =>
  useMutation({
    mutationKey: [],
    mutationFn: ({ params, config }) =>
      patchEditTemplate({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  })
