export const useApiBase = () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || 'http://localhost:5000'

  const getAuthToken = (): string => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem('sikap_auth_user')
        if (saved) {
          const parsed = JSON.parse(saved)
          return parsed.token || ''
        }
      } catch (e) {}
    }
    return ''
  }

  // Unified Request Wrapper
  const request = async <T>(
    path: string,
    options: any = {}
  ): Promise<{ data: T; isFallback?: boolean; error?: any }> => {
    const url = `${apiBase}${path}`
    const token = getAuthToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    try {
      const response = await $fetch<any>(url, {
        ...options,
        headers,
      })

      // Backend format: { status, message, data }
      if (response && response.data !== undefined) {
        return { data: response.data }
      }
      return { data: response }
    } catch (err: any) {
      console.warn(
        `[SIKAP API] Endpoint ${path} error:`,
        err?.data?.message || err?.message || 'Server error'
      )
      return { data: null as any, isFallback: true, error: err }
    }
  }

  return {
    apiBase,
    request,
    getAuthToken,
  }
}

