import type { FC } from 'react'

import { endOfToday, startOfToday } from 'date-fns'

import { v4 as uuid } from 'uuid'

import type { Canvas } from '@/models/canvas'

import { CanvasEditorComponent } from './CanvasEditorComponent'
import { CanvasPropertiesComponent } from './CanvasPropertiesComponent'
import { CanvasPreviewComponent } from './CanvasPreviewComponent'

export type CanvasComponentProps = { canvas: Canvas }

export type CanvasElementType = {
  construct: () => Canvas

  editorComponent: FC<CanvasComponentProps>
  propertiesComponent: FC<CanvasComponentProps>
  previewComponent: FC<CanvasComponentProps>
}

export const CanvasElement: CanvasElementType = {
  construct: () => ({
    id: uuid(),
    properties: {
			dateRange: {
				from: startOfToday(),
				to: endOfToday(),
			}
    },
  }),
  editorComponent: CanvasEditorComponent,
  propertiesComponent: CanvasPropertiesComponent,
  previewComponent: CanvasPreviewComponent,
}

export function CanvasEditorWrapper({ canvas }: { canvas: Canvas }) {
  const Wrapper = CanvasElement.editorComponent
  return <Wrapper canvas={canvas} />
}

export function CanvasPropertiesWrapper({ canvas }: { canvas: Canvas }) {
  const Wrapper = CanvasElement.propertiesComponent
  return <Wrapper canvas={canvas} />
}

export function CanvasPreviewWrapper({ canvas }: { canvas: Canvas }) {
  const Wrapper = CanvasElement.previewComponent
  return <Wrapper canvas={canvas} />
}
