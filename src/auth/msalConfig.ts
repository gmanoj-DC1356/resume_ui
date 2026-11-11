// Placeholder for MSAL configuration. Fill in real AAD values and initialise
// PublicClientApplication here once the app registration (SPA + API scopes) exists.
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AAD_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT_ID ?? 'common'}`,
    redirectUri: import.meta.env.VITE_AAD_REDIRECT_URI ?? window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};
