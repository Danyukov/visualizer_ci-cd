import { $imby } from '@/api/axios'
import {
  Asset,
  MeasurementData,
  MeasurementDto,
  MeasurementVersion,
  Plant,
  Project,
} from '@/models/imby'

export type GetProjectsConfig = AxiosRequestConfig

export const getProjects = async ({ config }: GetProjectsConfig) =>
  $imby.get<ApiResponse<Project[]>>(`/Db/GetProjectList`, config)

export type GetPlantsParams = { projectGuid: Project['projectGuid'] }
export type GetPlantsConfig = AxiosRequestConfig<GetPlantsParams>

export const getPlants = async ({ params, config }: GetPlantsConfig) =>
  $imby.get<ApiResponse<Plant[]>>(
    `/Db/GetPlantsForProjects?projectGuid=${params.projectGuid}`,
    config
  )

export type GetAssetsParams = { plantGuid: Plant['plantGuid'] }
export type GetAssetsConfig = AxiosRequestConfig<GetAssetsParams>

export const getAssets = async ({ params, config }: GetAssetsConfig) =>
  $imby.get<ApiResponse<Asset[]>>(`/Db/GetAssetListForPlant?plantGUid=${params.plantGuid}`, config)

export type GetMeasurementsParams = { assetGuid: Asset['assetGuid'] }
export type GetMeasurementsConfig = AxiosRequestConfig<GetMeasurementsParams>

export const getMeasurements = async ({ params, config }: GetMeasurementsConfig) =>
  $imby.get<ApiResponse<MeasurementDto[]>>(
    `/Db/GetMeasurementsForAsset?assetGuid=${params.assetGuid}&outputFormat=dto`,
    config
  )

export type GetMeasurementVersionsParams = { measurementGuid: MeasurementDto['measurementGuid'] }
export type GetMeasurementVersionsConfig = AxiosRequestConfig<GetMeasurementVersionsParams>

export const getMeasurementVersions = async ({ params, config }: GetMeasurementVersionsConfig) =>
  $imby.get<ApiResponse<MeasurementVersion[]>>(
    `/Db/GetMeasurementsVersionsForMeasurement?measurementGuid=${params.measurementGuid}`,
    config
  )

export type GetMeasurementDataParams = {
  measurementVersionGuid: MeasurementVersion['measurementVersionGuid']
  dateRange: {
    from: Date
    to: Date
  }
}
export type GetMeasurementDataConfig = AxiosRequestConfig<GetMeasurementDataParams>

export const getMeasurementData = async ({ params, config }: GetMeasurementDataConfig) =>
  $imby.get<ApiResponse<MeasurementData[]>>(
    `/Db/GetMeasurementData?measurementVersionGuid=${params.measurementVersionGuid}&dateTimeFrom=${params.dateRange.from}&dateTimeTo=${params.dateRange.to}`,
    config
  )

export type GetFirstMeasurementValueParams = {
  measurementVersionGuid: MeasurementVersion['measurementVersionGuid']
}
export type GetFirstMeasurementValueConfig = AxiosRequestConfig<GetFirstMeasurementValueParams>

export const getFirstMeasurementValue = async ({
  params,
  config,
}: GetFirstMeasurementValueConfig) =>
  $imby.get<
    ApiResponse<{
      value: number
      timeStamp: string
    }>
  >(`/Db/GetFirstMeasurementValue?measurementVersionGuid=${params.measurementVersionGuid}`, config)

export type GetLatestMeasurementValueParams = {
  measurementVersionGuid: MeasurementVersion['measurementVersionGuid']
}
export type GetLatestMeasurementValueConfig = AxiosRequestConfig<GetLatestMeasurementValueParams>

export const getLatestMeasurementValue = async ({
  params,
  config,
}: GetLatestMeasurementValueConfig) =>
  $imby.get<
    ApiResponse<{
      value: number
      timeStamp: string
    }>
  >(`/Db/GetLatestMeasurementValue?measurementVersionGuid=${params.measurementVersionGuid}`, config)
