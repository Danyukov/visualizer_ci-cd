import { $api } from '@/api/axios'
import { Canvas } from '@/models/canvas'
import { Template, TemplateUpdateSchema } from '@/models/template'
import { postCreateDashboard } from '../dashboards'
import { User } from '@/models/user'

export type PostCreateTemplateParams = {
  name: string
  canvases: Canvas[]
}
export type PostCreateTemplateConfig = AxiosRequestConfig<PostCreateTemplateParams>

export const postCreateTemplate = async ({ params, config }: PostCreateTemplateConfig) =>
  $api.post<ApiResponse<string>>('/templates', params, config)

export type PostSaveAsTemplateParams = PostCreateTemplateParams & {
  userId: User['id']
  withDashboard: boolean
}
export type PostSaveAsTemplateConfig = AxiosRequestConfig<PostSaveAsTemplateParams>

export const postSaveAsTemplate = async ({ params, config }: PostSaveAsTemplateConfig) => {
  const createTemplateResponse = await postCreateTemplate({
    params: {
      name: params.name,
      canvases: params.canvases,
    },
    config,
  })

  if (params.withDashboard) {
    const createDashboardResponse = await postCreateDashboard({
      params: {
        name: params.name,
        canvases: params.canvases,
        templateId: createTemplateResponse.data.data,
        userId: params.userId,
      },
      config,
    })

    return {
      createTemplateResponse,
      createDashboardResponse,
    }
  }

  return createTemplateResponse
}

export type GetTemplatesParams = { canvases: boolean }
export type GetTemplatesConfig = AxiosRequestConfig<GetTemplatesParams>

export const getTemplates = async ({ params, config }: GetTemplatesConfig) =>
  $api.get<ApiResponse<Template[]>>(`/templates?canvases=${params.canvases}`, config)

export type GetTemplateByIdParams = { templateId: string }
export type GetTemplateByIdConfig = AxiosRequestConfig<GetTemplateByIdParams>

export const getTemplateById = async ({ params, config }: GetTemplateByIdConfig) =>
  $api.get<ApiResponse<Template>>(`/templates/${params.templateId}`, config)

export type PatchEditTemplateParams = { templateId: string; data: TemplateUpdateSchema }
export type PatchEditTemplateConfig = AxiosRequestConfig<PatchEditTemplateParams>

export const patchEditTemplate = async ({ params, config }: PatchEditTemplateConfig) =>
  $api.patch<ApiResponse>(`/templates/${params.templateId}`, params.data, config)

// type DeleteTemplateParams = {}
// type DeleteTemplateConfig = AxiosRequestConfig<DeleteTemplateParams>

// export const deleteTemplate = async ({ params, config }: DeleteTemplateConfig) => {}
