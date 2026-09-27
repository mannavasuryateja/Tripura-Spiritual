import React from 'react';
import { useApp } from '../context/AppContext';

interface RoleGuardProps {
  allowedRoles?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * RoleGuard Component for Tripura Spiritual
 * Ensures UI components and sensitive features are only rendered for authorized roles:
 * - ROLE_SEEKER (Basic Seeker)
 * - ROLE_ENROLLED (Live & Recording Enrolled Seeker)
 * - ROLE_ADMIN (Platform Administrator)
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles = [],
  fallback = null,
  children
}) => {
  const { user } = useApp();

  if (!user.isLoggedIn) {
    return <>{fallback}</>;
  }

  const currentRole = user.role || 'ROLE_SEEKER';

  // Platform Admin has implicit access to all views
  if (currentRole === 'ROLE_ADMIN') {
    return <>{children}</>;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
