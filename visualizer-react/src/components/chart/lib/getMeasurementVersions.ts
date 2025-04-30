import type { Chart } from '@/models/chart'

type MeasurementVersion = {
  measurementVersionGuid: string
  measurementVersionName: string
}

export function getMeasurementVersions(chart: Chart): MeasurementVersion[] | null {
  console.log(chart)

  if (!chart.measurements) {
    return null
  }

  return chart.measurements.map((measurement) => ({
    measurementVersionGuid: measurement.connection.measurementVersionId,
    measurementVersionName: measurement.connection.measurementVersionName,
  }))
}
