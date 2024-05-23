import { Navigate } from 'react-router-dom';
import { UserContext } from './authentication/UserContextProvider';
import { useContext } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { nameofUser } = useContext(UserContext);

  if (!allowedRoles.includes(nameofUser)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;