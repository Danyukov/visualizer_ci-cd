import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/shared/ui/button'

export function BackButton() {
  const navigate = useNavigate()

  const handleClick = () => {
    if (window.history.length > 2) {
      navigate(-1)
    }
    else {
      navigate('/')
    }
  }

  return (
    <Button size="sm" variant="ghost" className="w-max" onClick={handleClick}>
      <ChevronLeft />
      {' '}
      Back
    </Button>
  )
}
