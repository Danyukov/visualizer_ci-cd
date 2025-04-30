import { Loader as Spinner } from 'lucide-react'

export function Loader() {
  return (
    <>
      <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex justify-center items-center">
        <Spinner className="animate-spin text-primary" />
      </div>
    </>
  )
}
