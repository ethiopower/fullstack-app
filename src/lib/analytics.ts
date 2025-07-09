// Check if the user has opted out of analytics
export const isAnalyticsOptedOut = () => {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem('ga-opt-out') === 'true'
}

// Set analytics opt-out preference
export const setAnalyticsOptOut = (optOut: boolean) => {
  if (typeof window === 'undefined') return
  if (optOut) {
    window.localStorage.setItem('ga-opt-out', 'true')
    window.document.documentElement.setAttribute('data-google-analytics-opt-out', 'true')
  } else {
    window.localStorage.removeItem('ga-opt-out')
    window.document.documentElement.removeAttribute('data-google-analytics-opt-out')
  }
}

// Initialize analytics opt-out state
export const initAnalytics = () => {
  if (typeof window === 'undefined') return
  const optedOut = isAnalyticsOptedOut()
  if (optedOut) {
    window.document.documentElement.setAttribute('data-google-analytics-opt-out', 'true')
  }
} 