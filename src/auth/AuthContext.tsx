import { useMemo, useState, type ReactNode } from 'react';
import type { User } from '@/types/domain';
import { AuthContext, type AuthContextValue } from '@/auth/useAuth';

// Placeholder demo user — replace with the MSAL account once AAD SSO is wired up.
const DEMO_USER: User = {
  id: 'u_demo',
  displayName: 'Demo User',
  email: 'demo.user@example.com',
  roles: ['recruiter'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: () => setUser(DEMO_USER),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
