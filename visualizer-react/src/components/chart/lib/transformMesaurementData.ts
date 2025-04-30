import type { AxiosResponse } from 'axios'

import type { MeasurementValue } from '@/models/imby'

/**
 * Преобразует массив ответов от сервера, где каждый запрос вернул MeasurementValue[],
 * в единый массив объектов вида:
 * [
 *   {
 *     datetime: string,
 *     "Name1": number,
 *     "Name2": number
 *   },
 *   ...
 * ]
 * @param responses - массив ответов от axios
 * @param versions - массив с информацией о версиях (guid и имя)
 * @returns массив объектов с объединёнными данными
 */
export function transformMeasurementData(
  responses: Array<AxiosResponse<MeasurementValue[]>>,
  versions: { measurementVersionGuid: string, measurementVersionName: string }[],
): Array<{ [key: string]: any }> {
  const result: Array<{ [key: string]: any }> = []

  // Обходим каждый ответ (каждый запрос по одной версии измерения)
  responses.forEach((response, index) => {
    // Берем название измерения, связанное с этим ответом
    const measurementName = versions[index].measurementVersionName

    // Проходим по массиву MeasurementValue
    response.data.forEach((mv) => {
      // Ищем, есть ли уже объект в result с таким же datetime
      const existingEntry = result.find(item => item.datetime === mv.dateTime)

      if (existingEntry) {
        // Если нашли, добавляем поле вида existingEntry["Имя измерения"] = mv.value
        existingEntry[measurementName] = mv.value
      }
      else {
        // Иначе создаем новый объект
        result.push({
          datetime: mv.dateTime,
          [measurementName]: mv.value,
        })
      }
    })
  })

  return result
}
