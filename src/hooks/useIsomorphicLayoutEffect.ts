import { useEffect, useLayoutEffect } from 'react'

/**
 * Layout effects do not run during server rendering, and React warns when they
 * are used there. Prerendered pages need the effect variant that lets the
 * client correct itself before the first post-hydration paint.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect
