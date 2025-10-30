import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
export const InstructorRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are not present in JWT (backend doesn't embed roles), allow access for now
  const rolesMissing = user.roles === undefined || user.roles === null;
  const hasInstructorRole = Array.isArray(user.roles) && user.roles.includes('INSTRUCTOR');
  if (!rolesMissing && !hasInstructorRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};