import { z } from 'zod'

/**
 * Схема окружения.
 * - Все поля обязательны (кроме тех, которые вы явно помечаете .optional()).
 * - .nonempty() позволяет удостовериться, что строка не пустая.
 * - .strict() запрещает любые поля, не описанные в схеме,
 *   чтобы избежать неявных ошибок (если хотите позволить лишние поля, уберите .strict()).
 */
const environmentSchema = z
  .object({
    BASE_URL: z.string().nonempty('BASE_URL is required'),

    DEV: z.boolean(),

    MODE: z.enum(['development', 'staging', 'production']),
    PROD: z.boolean(),
    SSR: z.boolean(),

    // Если нужно убедиться, что токен не пуст, используем nonempty()
    VITE_IMBY_API_ACCESS_TOKEN: z.string().nonempty('VITE_IMBY_API_ACCESS_TOKEN is required'),

    // Проверяем, что это валидный URL и не пустой
    VITE_IMBY_API_URL: z.string().url().nonempty('VITE_IMBY_API_URL is required'),

    VITE_ORIGIN_API_URL: z.string().url().nonempty('VITE_ORIGIN_API_URL is required'),

    // SENTRY_DSN может быть пустым — смотрите по потребности
    // Если надо, используем nonempty()
    VITE_SENTRY_DSN: z.string().nonempty('VITE_SENTRY_DSN is required'),
  })
  .strict()

type EnvironmentSchemaType = z.infer<typeof environmentSchema>

/**
 * Типизированный объект окружения.
 * Если какая-то из проверок не проходит, при запуске возникнет ошибка.
 */
export const zEnv: EnvironmentSchemaType = environmentSchema.parse(import.meta.env)
