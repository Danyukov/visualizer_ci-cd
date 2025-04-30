import type { RefObject } from 'react'

import { Maximize, Minimize } from 'lucide-react'

import { useFullscreen } from '@/shared/hooks/useFullscreen'
import { Button } from '@/shared/ui/button'

export function PreviewBtn<T extends HTMLElement>({ containerRef }: { containerRef: RefObject<T> }) {
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)
  return (
    <>
      {!isFullscreen
        ? (
            <Button onClick={toggleFullscreen} className="w-6 h-6" variant="ghost" size="icon">
              <Maximize />
            </Button>
          )
        : (
            <Button onClick={toggleFullscreen} className="w-6 h-6" variant="ghost" size="icon">
              <Minimize />
            </Button>
          )}
    </>
  )
}
