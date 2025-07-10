// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Check if the user has opted out of analytics
export const isAnalyticsOptedOut = (): boolean => {
  if (!isBrowser) return false
  return window.localStorage.getItem('ga-opt-out') === 'true'
}

// Set analytics opt-out preference
export const setAnalyticsOptOut = (optOut: boolean): void => {
  if (!isBrowser) return
  if (optOut) {
    window.localStorage.setItem('ga-opt-out', 'true')
    window.document.documentElement.setAttribute('data-google-analytics-opt-out', 'true')
  } else {
    window.localStorage.removeItem('ga-opt-out')
    window.document.documentElement.removeAttribute('data-google-analytics-opt-out')
  }
}

// Initialize analytics opt-out state
export const initAnalytics = (): void => {
  if (!isBrowser) return
  const optedOut = isAnalyticsOptedOut()
  if (optedOut) {
    window.document.documentElement.setAttribute('data-google-analytics-opt-out', 'true')
  }
} 