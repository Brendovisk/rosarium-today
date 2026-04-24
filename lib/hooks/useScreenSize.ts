'use client'

import { useState, useEffect } from 'react'

export function useScreenSize() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  )

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { width, isAbove: (breakpoint: number) => width >= breakpoint }
}
