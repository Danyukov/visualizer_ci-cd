import { useUser } from '@/contexts/user/hook'
import { useEffect, useState } from 'react'

export const Clocks = () => {
  const { timeZone } = useUser()

  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    updateTime()

    const intervalId = setInterval(updateTime, 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const updateTime = () => {
    const brusselsTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())
    setCurrentTime(brusselsTime)
  }

  return <div>Current time - {currentTime}</div>
}
