import { BackButton } from '@/components/BackButton'
import { useDashboard } from '@/contexts/dashboard/hook'
import { VisualizationSettingsSheetBtn } from '@/features/dashboard/EditVisualization'
import { PublishVisualization } from '@/features/dashboard/PublishVisualization'
import { SaveVisualization } from '@/features/dashboard/SaveVisualization'
import { ShareVisualization } from '@/features/dashboard/ShareVisualization'
import { Badge } from '@/shared/ui/badge'

export function VisualizationEditorPageTopbar() {
  const { dashboard } = useDashboard()
  return (
    <div className='flex justify-between items-center gap-4 border-b px-5 py-2'>
      <div className='flex items-center gap-8'>
        <BackButton />
        <Badge variant='secondary'>{dashboard?.name}</Badge>
      </div>
      <div className='flex gap-2'>
        <SaveVisualization />
        <PublishVisualization />
        <ShareVisualization />
        <VisualizationSettingsSheetBtn />
      </div>
    </div>
  )
}
