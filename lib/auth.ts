import { api } from "@/lib/api"
import { getTokens, setTokens, clearTokens } from "@/lib/tokens"

export const auth = {
  verifyEmail(email: string, token: string) {
    return api.post<{ message: string }>("/api/verify-email/", { email, token })
  },

  async login(email: string, password: string) {
    const data = await api.post<{ access: string; refresh: string }>("/api/login/", {
      email,
      password,
    })
    setTokens(data.access, data.refresh)
    return data
  },

  register(email: string, password: string, password2: string, display_name?: string) {
    return api.post("/api/register/", { email, password, password2, display_name })
  },

  async logout() {
    const tokens = getTokens()
    if (tokens) {
      try {
        await api.post("/api/logout/", { refresh: tokens.refresh })
      } catch {}
    }
    clearTokens()
  },

  isAuthenticated() {
    return getTokens() !== null
  },

  requestPasswordReset(email: string) {
    return api.post("/api/forgot-password/", { email })
  },

  confirmPasswordReset(email: string, otp: string, new_password: string) {
    return api.post("/api/reset-password/", { email, otp, new_password })
  },
}