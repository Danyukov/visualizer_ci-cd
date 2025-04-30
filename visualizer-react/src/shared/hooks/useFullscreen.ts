import type { RefObject } from 'react'

import { useCallback, useEffect, useState } from 'react'

/**
 * Хук для управления полноэкранным режимом выбранного элемента.
 * @param ref Ссылка (ref) на элемент, который хотим отобразить во весь экран
 * @returns
 *  - isFullscreen: boolean, флаг, находимся ли в полноэкранном режиме
 *  - enterFullscreen(): Promise<void> — войти в fullscreen
 *  - exitFullscreen(): Promise<void> — выйти
 *  - toggleFullscreen(): Promise<void> — переключить
 */
export function useFullscreen<T extends HTMLElement>(ref: RefObject<T>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Следим за системным событием fullscreenchange
  useEffect(() => {
    function handleChange() {
      // Если fullscreenElement равен нашему элементу, значит мы в fullscreen
      setIsFullscreen(document.fullscreenElement === ref.current)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
    }
  }, [ref])

  const enterFullscreen = useCallback(async () => {
    if (!ref.current)
      return
    if (!document.fullscreenElement) {
      await ref.current.requestFullscreen()
    }
  }, [ref])

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen()
    }
    else {
      await enterFullscreen()
    }
  }, [isFullscreen, exitFullscreen, enterFullscreen])

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}
