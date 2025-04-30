package middlewares

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "os"
)

func CorsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Получаем адрес фронтенда из переменной окружения
        origin := os.Getenv("VITE_ORIGIN_API_URL")
        if origin == "" {
            origin = "http://localhost:5173"  // Значение по умолчанию
        }

        // Устанавливаем заголовки CORS
        c.Writer.Header().Set("Access-Control-Allow-Origin", origin)  // Разрешаем доступ с указанного источника
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")  // Разрешаем отправку cookies
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, baggage, sentry-trace")  // Разрешаем нужные заголовки
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")  // Разрешаем методы

        // Обрабатываем preflight запросы (OPTIONS)
        if c.Request.Method == http.MethodOptions {
            c.AbortWithStatus(http.StatusOK)  // Отвечаем 200 OK на OPTIONS запрос
            return
        }

        // Пропускаем запрос дальше
        c.Next()
    }
}
