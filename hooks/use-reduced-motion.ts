import * as React from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

/** True when the visitor asked for reduced motion. False during SSR and until mounted. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener("change", onChange)
    setReduced(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!reduced
}
