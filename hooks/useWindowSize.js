"use client"

import { useState, useEffect } from "react"

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      handleResize() // Call handler right away so state gets updated with initial window size

      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return windowSize
}
