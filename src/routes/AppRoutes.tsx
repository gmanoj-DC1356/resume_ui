import { ProtectedRoute } from '@/auth/ProtectedRoute';
import {
  CANDIDATE_PATH,
  CANDIDATE_ROUTE,
  JD_PATH,
  MATCHES_PATH,
  MATCHES_SESSION_ROUTE,
} from '@/routes/paths';
import { Login } from '@/pages/Login/Login';
import { Workspace } from '@/pages/Workspace/Workspace';
import { Navigate, Route, Routes } from 'react-router-dom';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* One layout route keeps the workspace mounted while the tab (URL) changes. */}
      <Route
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      >
        {[JD_PATH, MATCHES_PATH, MATCHES_SESSION_ROUTE, CANDIDATE_PATH, CANDIDATE_ROUTE].map((path) => (
          <Route key={path} path={path} element={null} />
        ))}
      </Route>
      <Route path="/" element={<Navigate to={JD_PATH} replace />} />
      <Route path="*" element={<Navigate to={JD_PATH} replace />} />
    </Routes>
  );
}
