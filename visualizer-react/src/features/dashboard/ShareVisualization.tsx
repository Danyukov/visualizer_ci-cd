import { Copy, Globe, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { useDashboard } from '@/contexts/dashboard/hook'

export function ShareVisualization() {
  const { dashboard } = useDashboard()
  const shareUrl = `${window.location.origin}/preview/${dashboard?.shareId}`

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } else {
      toast.error('Clipboard API not supported')
    }
  }

  if (!dashboard?.published) {
    return null
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Share2 />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this visualization</DialogTitle>
            <DialogDescription>Anyone with the link can view this visualization</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input readOnly aria-readonly value={shareUrl} />
            <Button className='w-full' onClick={handleCopyLink}>
              <Copy className='h-4 w-4 mr-2' />
              Copy link
            </Button>

            <div className='space-y-4 text-sm'>
              <h3 className='text-sm text-muted-foreground'>Who has access</h3>

              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    <Globe className='size-5 text-muted-foreground' />
                    <span>Anyone</span>
                  </div>
                  <span className='text-muted-foreground'>can view</span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Avatar className='size-6'>
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex items-center gap-1'>
                    Admin <span className='text-muted-foreground'>(you)</span>
                  </div>
                </div>
                <span className='text-muted-foreground'>owner</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
