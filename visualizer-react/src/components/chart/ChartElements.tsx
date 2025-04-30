import type { ElementType, FC } from 'react'

import type { Canvas } from '@/models/canvas'
import type { Chart } from '@/models/chart'

import { ComposedChartElement } from './variants/ComposedChartElement'

export type ChartElementsType = 'Composed'

export type ChartComponentProps = {
  canvasInstance: Canvas
  chartInstance: Chart
}

export type ChartElementType = {
  type: ChartElementsType

  construct: (id: Chart['id']) => Chart

  buttonComponent: {
    icon: ElementType
    label: string
  }

  editorComponent: FC<ChartComponentProps>
  propertiesComponent: FC<ChartComponentProps>
  previewComponent: FC<ChartComponentProps>
}

type FormElementsType = {
  [key in ChartElementsType]: ChartElementType
}

export const ChartElements: FormElementsType = {
  Composed: ComposedChartElement,
}
