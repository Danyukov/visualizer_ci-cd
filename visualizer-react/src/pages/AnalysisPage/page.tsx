import { AnalyzeContent } from './ui/AnalyzeContent'
import { AnalyzeHeader } from './ui/AnalyzeHeader'
import { AnalyzeSidebar } from './ui/AnalyzeSidebar'

export default function AnalyzePage() {
  return (
    <div className="h-[calc(100vh)]">
      <div className="w-full min-h-screen grid grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
        <AnalyzeSidebar />
        <div className='flex flex-col'>
          <AnalyzeHeader />
          <AnalyzeContent />
        </div>
      </div>
    </div>
  )
}
