import { getTokens, setTokens, clearTokens } from "@/lib/tokens"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`Request failed with status ${status}`)
    this.name = "ApiError"
  }
}

async function rawRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has("Accept")) headers.set("Accept", "application/json")
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")

  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers,
  })

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens()
  if (!tokens) return null
  try {
    const data = await rawRequest<{ access: string }>("/api/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: tokens.refresh }),
    })
    setTokens(data.access, tokens.refresh)
    return data.access
  } catch {
    clearTokens()
    return null
  }
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const tokens = getTokens()
  const headers = new Headers(init?.headers)
  if (tokens) headers.set("Authorization", `Bearer ${tokens.access}`)

  try {
    return await rawRequest<T>(path, { ...init, headers })
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && tokens) {
      const newAccess = await refreshAccessToken()
      if (newAccess) {
        headers.set("Authorization", `Bearer ${newAccess}`)
        return await rawRequest<T>(path, { ...init, headers })
      }
    }
    throw err
  }
}

export const api = {
  post<T>(path: string, body: unknown) {
    return rawRequest<T>(path, { method: "POST", body: JSON.stringify(body) })
  },
  get<T>(path: string) {
    return authRequest<T>(path, { method: "GET" })
  },
  authPost<T>(path: string, body: unknown) {
    return authRequest<T>(path, { method: "POST", body: JSON.stringify(body) })
  },
  patch<T>(path: string, body: unknown) {
    return authRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) })
  },
  delete<T>(path: string) {
    return authRequest<T>(path, { method: "DELETE" })
  },
}