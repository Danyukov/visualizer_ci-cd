import { useQuery } from '@tanstack/react-query'

import type {
  Asset,
  GetValuesProps,
  Measurement,
  MeasurementVersion,
  Plant,
  Project,
} from '@/models/imby'

import { queryKeys } from '@/shared/constants/queryKeys'

import { imbyService } from './service'

export function useGetProjectsQuery() {
  return useQuery({
    queryKey: [queryKeys.GET_PROJECTS],
    queryFn: () => imbyService.getProjects(),
  })
}

export function useGetPlantsByProjectGuid(projectGuid: Project['projectGuid'] | undefined) {
  return useQuery({
    queryKey: [queryKeys.GET_PLANTS],
    queryFn: () => imbyService.getPlantsByProjectGuid(projectGuid!),
    enabled: Boolean(projectGuid),
  })
}

export function useGetAssetsByPlantGuid(plantGuid: Plant['plantGuid'] | undefined) {
  return useQuery({
    queryKey: [queryKeys.GET_ASSETS],
    queryFn: () => imbyService.getAssetsByPlantGuid(plantGuid!),
    enabled: Boolean(plantGuid),
  })
}

export function useGetMeasurementsByAssetGuid(assetGuid: Asset['assetGuid'] | undefined) {
  return useQuery({
    queryKey: [queryKeys.GET_MEASUREMENTS_BY_ASSET_GUID],
    queryFn: () => imbyService.getMeasurementsByAssetGuid(assetGuid!),
    enabled: Boolean(assetGuid),
  })
}

export function useGetMeasurementVersions(
  measurementGuid: Measurement['measurementGuid'] | undefined
) {
  return useQuery({
    queryKey: [queryKeys.GET_MEASUREMENT_VERSIONS_BY_MEASUREMENT_GUID],
    queryFn: () => imbyService.getMeasurementVersionsByMeasurementGuid(measurementGuid!),
    enabled: Boolean(measurementGuid),
  })
}

export function useGetMeasurementDtoValues(payload: GetValuesProps) {
  return useQuery({
    queryKey: [
      queryKeys.GET_MEASUREMENT_DTO_VALUES,
      payload.versions.map((v) => v.measurementVersionGuid).join(','),
      payload.dateRange.from,
      payload.dateRange.to,
    ],
    queryFn: () => imbyService.getMeasurementValues(payload),
    enabled: false,
  })
}

// TODO: useGetFirstAndLastValue
export function useGetFirstValue(
  measurementVersionGuid: MeasurementVersion['measurementVersionGuid']
) {
  return useQuery({
    queryKey: [queryKeys.GET_FIRST_VALUE, measurementVersionGuid],
    queryFn: () => imbyService.getFirstValue(measurementVersionGuid),
    enabled: Boolean(measurementVersionGuid),
  })
}

export function useGetLatestValue(
  measurementVersionGuid: MeasurementVersion['measurementVersionGuid']
) {
  return useQuery({
    queryKey: [queryKeys.GET_LATEST_VALUE, measurementVersionGuid],
    queryFn: () => imbyService.getLatestValue(measurementVersionGuid),
    enabled: Boolean(measurementVersionGuid),
  })
}
