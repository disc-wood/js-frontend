import { Navigate, Outlet } from 'react-router-dom';

import { useUser } from '@/common/contexts/UserContext';
import { useUser as useUserRole } from '@/common/hooks/useUser';

export function PrivateRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to='/login' replace />;
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !user ? <Outlet /> : <Navigate to='/dashboard' replace />;
}

export function ProgramRoute({ programId }) {
  const { user, isLoading: authLoading } = useUser();
  const { role, assignedPrograms, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to='/login' replace />;

  const hasAccess =
    role === 'admin' ||
    (role === 'supervisor' && assignedPrograms.includes(programId));

  return hasAccess ? <Outlet /> : <Navigate to='/' replace />;
}
