import type { AxiosResponse } from 'axios'

import { AxiosError } from 'axios'

import type {
  Asset,
  GetValuesProps,
  LatestMeasurementValue,
  Measurement,
  MeasurementData,
  MeasurementDto,
  MeasurementValueDto,
  MeasurementVersion,
  Plant,
  Project,
} from '@/models/imby'

import { $imby } from '@/api/axios'

export const imbyService = {
  getProjects: async () => {
    try {
      const response = await $imby.get<Project[]>('/Db/GetProjectList')
      return response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw new Error('Failed to fetch projects')
    }
  },
  getPlants: async () => {
    try {
      const response = await $imby.get<Plant[]>('/Db/GetPlantList')
      return response.data
    } catch (error) {
      console.error('Error fetching plants:', error)
      throw new Error('Failed to fetch plants')
    }
  },
  getPlantsByProjectGuid: async (projectGuid: Project['projectGuid']) => {
    try {
      const response = await $imby.get<Plant[]>(
        `/Db/GetPlantsForProjects?projectGuid=${projectGuid}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching plants:', error)
      throw new Error('Failed to fetch plants')
    }
  },
  getAssetsByPlantGuid: async (plantGuid: Plant['plantGuid']) => {
    try {
      const response = await $imby.get<Asset[]>(`/Db/GetAssetListForPlant?plantGUid=${plantGuid}`)
      return response.data
    } catch (error) {
      console.error('Error fetching assets:', error)
      throw new Error('Failed to fetch assets')
    }
  },
  getMeasurementsByAssetGuid: async (assetGuid: Asset['assetGuid']) => {
    try {
      const response = await $imby.get<MeasurementDto[]>(
        `/Db/GetMeasurementsForAsset?assetGuid=${assetGuid}&outputFormat=dto`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching measurements:', error)
      throw new Error('Failed to fetch measurements')
    }
  },
  getMeasurementsByPlantGuid: async (plantGuid: Plant['plantGuid']) => {
    try {
      const response = await $imby.get<Measurement[]>(
        `/Db/GetMeasurementsForPlant?plantGuid=${plantGuid}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching measurements:', error)
      throw new Error('Failed to fetch measurements')
    }
  },
  getMeasurementVersionsByMeasurementGuid: async (
    measurementGuid: Measurement['measurementGuid']
  ) => {
    try {
      const response = await $imby.get<MeasurementVersion[]>(
        `/Db/GetMeasurementsVersionsForMeasurement?measurementGuid=${measurementGuid}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching measurement versions:', error)
      throw new Error('Failed to fetch measurement versions')
    }
  },
  getMeasurementVersions: async (projectGuid: Project['projectGuid']) => {
    if (!projectGuid) return
    try {
      const response = await $imby.get<MeasurementVersion[]>(
        `/Db/GetMeasurementsVersionsForProject?projectGuid=${projectGuid}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching measurement versions:', error)
      throw new Error('Failed to fetch measurement versions')
    }
  },

  /**
   * Получает данные измерений для набора versions, используя dateRange
   * и отменяет запросы при таймауте в 10 секунд.
   *
   * @param payload - содержит versions[] и dateRange (from, to).
   * @returns Объект, где ключ - measurementVersionName, значение - массив MeasurementData[]
   */
  getValues: async (payload: GetValuesProps): Promise<Record<string, MeasurementData[]>> => {
    const controller = new AbortController()
    const { signal } = controller

    // Устанавливаем таймаут на 10 секунд
    const timeout = setTimeout(() => {
      controller.abort('Request timed out')
    }, 10000)

    // Формируем массив запросов
    const requests = payload.versions.map((item) =>
      $imby.get<MeasurementData[]>(
        `/Db/GetMeasurementData?measurementVersionGuid=${item.measurementVersionGuid}&dateTimeFrom=${payload.dateRange.from}&dateTimeTo=${payload.dateRange.to}`,
        { signal }
      )
    )

    try {
      // Выполняем все запросы параллельно
      const responses: AxiosResponse<MeasurementData[]>[] = await Promise.all(requests)

      // Формируем объект:
      // ключ = measurementVersionName, значение = массив с данными (MeasurementData[])
      const result: Record<string, MeasurementData[]> = {}

      responses.forEach((res, index) => {
        const versionName = payload.versions[index].measurementVersionName
        result[versionName] = res.data
      })

      return result
    } catch (error) {
      if (signal.aborted) {
        // Проверяем причину, если среда поддерживает reason
        if (signal.reason === 'Request timed out') {
          throw new Error('Request timed out')
        }
        throw new Error('Request was aborted')
      }

      if (error instanceof AxiosError) {
        throw new TypeError(`Axios error: ${error.message}`)
      } else {
        throw new TypeError(`Unknown error: ${String(error)}`)
      }
    } finally {
      clearTimeout(timeout)
    }
  },

  getFirstValue: async (measurementVersionGuid: MeasurementVersion['measurementVersionGuid']) => {
    const controller = new AbortController()
    const { signal } = controller

    const timeout = setTimeout(() => {
      controller.abort('Request timed out')
    }, 10000)

    try {
      const res = await $imby.get<LatestMeasurementValue>(
        `Db/GetFirstMeasurementValue?measurementVersionGuid=${measurementVersionGuid}`
      )
      return res.data
    } catch (error) {
      if (signal.aborted) {
        if (signal.reason === 'Request timed out') {
          throw new Error('Request timed out')
        }
        throw new Error('Request was aborted')
      }

      if (error instanceof AxiosError) {
        throw new TypeError(`Axios error: ${error.message}`)
      } else {
        throw new TypeError(`Unknown error: ${String(error)}`)
      }
    } finally {
      clearTimeout(timeout)
    }
  },
  getLatestValue: async (measurementVersionGuid: MeasurementVersion['measurementVersionGuid']) => {
    const controller = new AbortController()
    const { signal } = controller

    const timeout = setTimeout(() => {
      controller.abort('Request timed out')
    }, 10000)

    try {
      const res = await $imby.get<LatestMeasurementValue>(
        `Db/GetLatestMeasurementValue?measurementVersionGuid=${measurementVersionGuid}`
      )
      return res.data
    } catch (error) {
      if (signal.aborted) {
        if (signal.reason === 'Request timed out') {
          throw new Error('Request timed out')
        }
        throw new Error('Request was aborted')
      }

      if (error instanceof AxiosError) {
        throw new TypeError(`Axios error: ${error.message}`)
      } else {
        throw new TypeError(`Unknown error: ${String(error)}`)
      }
    } finally {
      clearTimeout(timeout)
    }
  },
  getMeasurementValues: async (
    payload: GetValuesProps
  ): Promise<Record<string, MeasurementValueDto>> => {
    const from = new Date(payload.dateRange.from).toISOString()
    const to = new Date(payload.dateRange.to).toISOString()

    const requests = payload.versions.map((item) => {
      const url = `/Db/GetMeasurementData?measurementVersionGuid=${item.measurementVersionGuid}&dateTimeFrom=${from}&dateTimeTo=${to}&outputFormat=dto`
      return $imby.get<MeasurementValueDto>(url)
    })

    try {
      const responses: AxiosResponse<MeasurementValueDto>[] = await Promise.all(requests)
      const result: Record<string, MeasurementValueDto> = {}
      responses.forEach((res, index) => {
        const versionName = payload.versions[index].measurementVersionName
        result[versionName] = res.data
      })
      return result
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TypeError(`Axios error: ${error.message}`)
      } else {
        throw new TypeError(`Unknown error: ${String(error)}`)
      }
    }
  },
}
