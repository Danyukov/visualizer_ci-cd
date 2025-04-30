import { z } from 'zod'

export const projectSchema = z.object({
  projectId: z.number(),
  projectName: z.string(),
  projectGuid: z.string(),
})

export type Project = z.infer<typeof projectSchema>

export const plantSchema = z.object({
  plantId: z.number(),
  plantName: z.string(),
  plantGuid: z.string(),
  plantGroupGuid: z.string(),
})

export type Plant = z.infer<typeof plantSchema>

export const assetSchema = z.object({
  assetId: z.number(),
  assetGuid: z.string(),
  assetName: z.string(),
  assetTypeGuid: z.string(),
  plantGuid: z.string(),
})

export type Asset = z.infer<typeof assetSchema>

export const measurementSchema = z.object({
  measurementId: z.number(),
  measurementGuid: z.string(),
  measurementName: z.string(),
  assetGuid: z.string(),
  unitGuid: z.string(),
})

export type Measurement = z.infer<typeof measurementSchema>

export const measurementDtoSchema = z.object({
  measurementGuid: z.string(),
  measurementName: z.string(),
  unit: z.string(),
})

export type MeasurementDto = z.infer<typeof measurementDtoSchema>

export const measurementVersionSchema = z.object({
  measurementVersionID: z.number(),
  measurementVersionGuid: z.string(),
  measurementGuid: z.string(),
  measurementVersionName: z.string(),
  measurementTypeGuid: z.string(),
  granularityGuid: z.string(),
  dataSourceGuid: z.string(),
  dateCreation: z.string(),
})

export type MeasurementVersion = z.infer<typeof measurementVersionSchema>

export const measurementValueDtoSchema = z.object({
  granularity: z.string(),
  units: z.string(),
  measurementValues: z.array(
    z.object({
      timeStamp: z.string(),
      value: z.number(),
    }),
  ),
})

export type MeasurementValueDto = z.infer<typeof measurementValueDtoSchema>

export const measurementValueSchema = z.object({
  measurementValueId: z.number(),
  createdAt: z.string(),
  dateTime: z.string(),
  value: z.number(),
  measurementValueGuid: z.string(),
  measurementVersionGuid: z.string(),
})

export type MeasurementValue = z.infer<typeof measurementValueSchema>

export const latestMeasurementValueSchema = z.object({
  timeStamp: z.string(),
  value: z.number(),
})

export type LatestMeasurementValue = z.infer<typeof latestMeasurementValueSchema>

export const measurementDataSchema = z.object({
  measurementValueGuid: z.string(),
  measurementVersionGuid: z.string(),
  measurementValueId: z.number(),
  value: z.number(),
  createdAt: z.date(),
  dateTime: z.string(),
})

export type MeasurementData = z.infer<typeof measurementDataSchema>

export const getValuesPropsSchema = z.object({
  versions: z.array(
    z.object({
      measurementVersionGuid: z.string(),
      measurementVersionName: z.string(),
    }),
  ),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
})

export type GetValuesProps = z.infer<typeof getValuesPropsSchema>
