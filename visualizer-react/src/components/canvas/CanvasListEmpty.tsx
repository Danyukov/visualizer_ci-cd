import { Button } from '@/shared/ui/button'
import { CanvasListProps } from './CanvasList'

interface CanvasListEmptyProps extends Pick<CanvasListProps, 'onCanvasAdd'> {}

export const CanvasListEmpty = ({ onCanvasAdd }: CanvasListEmptyProps) => {
  return (
    <div className='w-full h-full flex flex-col gap-3 justify-center items-center border border-dashed py-10 rounded-xl'>
      <div>
        <div className='font-medium'>Start from scratch</div>
        <p className='muted'>Add the first canvas</p>
      </div>
      <Button onClick={onCanvasAdd}>Add canvas</Button>
    </div>
  )
}
