import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

// Sample sign-in button only — replace with MSAL loginRedirect/loginPopup when SSO is wired up.
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSignIn() {
    login();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-primary to-brand-secondary px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="text-3xl">🔐</div>
        <h1 className="my-2 text-lg font-semibold text-brand-primary">Recruitment Copilot</h1>
        <p className="mb-4 text-sm text-brand-muted">Sign in with your organization account</p>
        <Button className="w-full" onClick={handleSignIn}>
          Sign in with Microsoft
        </Button>
      </div>
    </div>
  );
}
