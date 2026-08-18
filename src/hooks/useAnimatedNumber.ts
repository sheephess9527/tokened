import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

export function useAnimatedNumber(target: number, duration = 400): number {
  const [display, setDisplay] = useState(target)
  const displayRef = useRef(target)
  const frameRef = useRef(0)

  useEffect(() => {
    displayRef.current = display
  }, [display])

  useEffect(() => {
    const startValue = displayRef.current
    const diff = target - startValue
    if (diff === 0) return

    if (prefersReducedMotion()) {
      setDisplay(target)
      return
    }

    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(startValue + diff * eased))

      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return display
}
