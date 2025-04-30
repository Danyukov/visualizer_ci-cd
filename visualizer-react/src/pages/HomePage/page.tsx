import { useState } from 'react'

import { PageLayout } from '@/components/layouts/PageLayout'
import { VisualizationDataTable } from '@/components/tables/DashboardDataTable'
import { TemplateDataTable } from '@/components/tables/TemplateDataTable'
import { Card, CardContent, CardTitle } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { ProgressCircle } from '@/shared/ui/tremor/tremor-progress-circle'
import { useGetDashboardsQuery } from '@/api/hooks/dashboards'
import { useGetTemplatesQuery } from '@/api/hooks/templates'

type TabValueType = '1' | '2'

export default function HomePage() {
  const [tab, setTab] = useState<TabValueType>('1')

  return (
    <PageLayout className='flex flex-col gap-5'>
      <KPIs />
      <section>
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValueType)}>
          <TabsList>
            <TabsTrigger value='1'>Dashboards</TabsTrigger>
            <TabsTrigger value='2'>Templates</TabsTrigger>
          </TabsList>
          <TabsContent value='1'>
            <VisualizationDataTable />
          </TabsContent>
          <TabsContent value='2'>
            <TemplateDataTable />
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  )
}

function KPIs() {
  const { data: dashboards, isLoading: isDashboardsLoading } = useGetDashboardsQuery()
  const { data: templates, isLoading: isTemplatesLoading } = useGetTemplatesQuery({
    canvases: false,
  })

  if (isDashboardsLoading || isTemplatesLoading) {
    return <div>Loading...</div>
  }

  // Количество дашбордов
  const totalDashboards = dashboards?.data.data?.length ?? 0
  // Количество опубликованных дашбордов
  const publishedDashboards = dashboards?.data.data?.filter((item) => item.published).length ?? 0
  // Процент опубликованных дашбордов
  const publishedPercentage =
    totalDashboards === 0 ? 0 : (publishedDashboards / totalDashboards) * 100

  // Количество шаблонов
  const totalTemplates = templates?.data.data?.length ?? 0
  // Количество используемых шаблонов (чтобы шаблон был использован, нужно, чтобы его id присутствовало в дашборде)
  const usedTemplates =
    templates?.data.data?.filter((template) =>
      dashboards?.data.data?.some((visualization) => visualization.templateId === template.id)
    ).length ?? 0
  // Процент используемых шаблонов
  const usedTemplatesPercentage = totalTemplates === 0 ? 0 : (usedTemplates / totalTemplates) * 100

  return (
    <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-6'>
            <ProgressCircle value={publishedPercentage} radius={28} strokeWidth={4}>
              <span className='text-sm font-medium'>
                {publishedPercentage.toFixed(0)}
                &#37;
              </span>
            </ProgressCircle>
            <div className='space-y-1'>
              <CardTitle>Dashboards</CardTitle>
              <div>
                <div className='muted'>
                  {publishedDashboards} of {totalDashboards} published
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-6'>
            <ProgressCircle value={usedTemplatesPercentage} radius={28} strokeWidth={4}>
              <span className='text-sm font-medium'>
                {usedTemplatesPercentage.toFixed(0)}
                &#37;
              </span>
            </ProgressCircle>
            <div className='space-y-1'>
              <CardTitle>Templates</CardTitle>
              <div>
                <div className='muted'>
                  {usedTemplates} of {totalTemplates} used
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
