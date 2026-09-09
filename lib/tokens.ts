export function getTokens() {
    if (typeof window === "undefined") return null
    const access = localStorage.getItem("access_token")
    const refresh = localStorage.getItem("refresh_token")
    return access && refresh ? { access, refresh } : null
  }
  
  export function setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
  }
  
  export function clearTokens() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }