import logoEf from '@/assets/logo_ef-power.png'
import logoImby from '@/assets/logo_imby.jpg'
import { useParams } from 'react-router'

import { CanvasElement } from '@/components/canvas/Canvas'
import { Skeleton } from '@/shared/ui/skeleton'
import { Dashboard } from '@/models/dashboard'
import { useGetDashboardByShareId } from '@/api/hooks/dashboards'

export default function PreviewPage() {
  const { shareId } = useParams<{ shareId: string }>()

  const { data, isLoading } = useGetDashboardByShareId(
    {
      shareId: shareId!,
    },
    {
      options: {
        enabled: Boolean(shareId),
      },
    }
  )

  return (
    <>
      <div className='flex flex-col gap-5'>
        {isLoading ? (
          <Skeleton className='w-full h-24' />
        ) : (
          <> {data?.data.data && <PreviewPageHeader data={data.data.data} />} </>
        )}

        <section className='flex flex-col gap-5 p-5'>
          {data?.data?.data?.canvases?.map((item) => (
            <CanvasElement.previewComponent canvas={item} key={item.id} />
          ))}
        </section>
      </div>
    </>
  )
}

interface PreviewPageHeaderProps {
  data: Dashboard
}

const PreviewPageHeader = ({ data }: PreviewPageHeaderProps) => {
  const logo = data?.tenant === 'ef' ? logoEf : logoImby

  return (
    <header className='sticky top-0 z-10 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background'>
      <div className='flex items-center justify-between p-5'>
        <img src={logo} alt='logo' className='w-32' />
        <div className='flex flex-col gap-2'>
          <h1 className='text'>{data?.name}</h1>
          <div className='text-sm text-muted-foreground'>{data?.client}</div>
        </div>
      </div>
    </header>
  )
}
