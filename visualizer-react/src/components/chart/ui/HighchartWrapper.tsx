import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'

import type { Chart } from '@/models/chart'
import type { MeasurementValueDto } from '@/models/imby'

type HighchartWrapperProps = {
  chartElementInstance: Chart
  data: Record<string, MeasurementValueDto>
}

export function HighchartWrapper({ chartElementInstance, data }: HighchartWrapperProps) {
  const uniqueUnits: Set<string> = new Set()

  Object.entries(data).forEach(([, dto]) => {
    if (dto.units) {
      uniqueUnits.add(dto.units)
    }
  })

  const yAxis = Array.from(uniqueUnits).map((unit, index) => ({
    title: {
      text: unit,
    },
    lineWidth: 1,
    gridLineWidth: 1,
    gridLineColor: '#dcdcdc',
    labels: {
      style: {
        color: '#000',
        fontSize: '12px',
      },
    },
    opposite: index % 2 != 0,
  }))

  const series: Highcharts.SeriesOptionsType[] = Object.entries(data)
    .map(([measurementName, dto]) => {
      const measurement = chartElementInstance.measurements?.find(
        (m) => m.connection.measurementVersionName === measurementName
      )
      if (!measurement) return null

      const displayType = measurement.series?.type || 'line'

      const seriesData = dto.measurementValues.map((item) => {
        const timestamp = Date.parse(item.timeStamp) + 2 * 60 * 60 * 1000
        return [timestamp, item.value]
      }) as [number, number][]

      // const seriesData = dto.measurementValues.map((item) => {
      //   const timestamp = Date.parse(item.timeStamp)
      //   // const timeZonedTimestamp = toZonedTime(timestamp, 'Europe/Brussels')
      //   return [timestamp, item.value]
      // }) as [number, number][]

      seriesData.sort((a, b) => a[0] - b[0])

      // const grouping = parseGranularity(dto.granularity)

      const yAxisId = yAxis.findIndex((axis) => axis.title.text === dto.units)

      return {
        type: displayType,
        name: `${measurementName} [${dto.granularity}, ${dto.units}]`,
        data: seriesData,
        dashStyle: measurement.series?.dash ? 'Dash' : 'Solid',
        step: measurement.series?.step ? 'center' : undefined,
        yAxis: yAxisId,
        tooltip: {
          valueDecimals: 2,
          valueSuffix: dto.units ? ` ${dto.units}` : '',
        },
      } as Highcharts.SeriesOptionsType
    })
    .filter(Boolean) as Highcharts.SeriesOptionsType[]

  const options: Highcharts.Options = {
    chart: { height: 600 },
    xAxis: {
      title: {
        text: 'datetime (UTC)',
      },
      type: 'datetime',
      lineWidth: 1,
      gridLineWidth: 1,
    },
    plotOptions: {
      series: {
        connectNulls: false,
        dataGrouping: {
          enabled: true,
        },
        boostThreshold: 1,
        turboThreshold: 0,
      },
    },
    boost: {
      enabled: true,
      allowForce: true,
      pixelRatio: 1,
      seriesThreshold: 1,
      useGPUTranslations: true,
      usePreallocated: true,
    },
    yAxis,
    credits: { enabled: false },
    rangeSelector: {
      enabled: false,
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
    series,
  }

  return <HighchartsReact highcharts={Highcharts} constructorType='stockChart' options={options} />
}

// function parseGranularity(granularity: string) {
//   switch (granularity) {
//     case '1 minute':
//       return {
//         forced: true,
//         units: [['minute', [1]]],
//       }
//     case '5 minutes':
//       return {
//         forced: true,
//         units: [['minute', [5]]],
//       }
//     case '15 minutes':
//       return {
//         forced: true,
//         units: [['minute', [15]]],
//       }
//     case '1 hour':
//       return {
//         forced: true,
//         units: [['hour', [1]]],
//       }
//     case '1 day':
//       return {
//         forced: true,
//         units: [['day', [1]]],
//       }
//     default:
//       return {
//         enabled: false,
//       }
//   }
// }
