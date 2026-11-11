import axios from 'axios';

// Base axios instance for all backend calls. The Django API sits behind this
// single client so auth headers, error handling and base URL stay in one place.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  // The Django API currently authenticates with its session cookie; Django's CSRF token is echoed back in a header.
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the bearer token from the auth context on every request once SSO is wired up.
export function setAuthToken(token: string | null): void {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralised place to map 401/403/422 to UI-friendly errors once implemented.
    return Promise.reject(error);
  },
);
