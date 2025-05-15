const isProd = import.meta.env.MODE === "production"

export const apiUrl = (path) => {
  return isProd
    ? `${import.meta.env.VITE_API_URL}${path}` // Path used when site is deployed
    : `/${path}` // Path used when in dev mode
}

export const apiConfig = (additionalConfig = {}) => {
  return {
    withCredentials: true,
    ...additionalConfig
  }
}

export const apiConfigCsrf = (csrfToken, additionalConfig = {}) => {
  return {
    withCredentials: true,
    headers: { "X-CSRF-Token": csrfToken },
    ...additionalConfig
  }
}
