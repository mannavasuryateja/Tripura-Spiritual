import React from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { Shield } from 'lucide-react';
import { RoleGuard } from '../components/RoleGuard';

export const Admin: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RoleGuard
        allowedRoles={['ROLE_ADMIN']}
        fallback={
          <div className="max-w-lg mx-auto p-8 bg-purple-50 rounded-3xl border border-purple-200 text-center space-y-4 my-12">
            <Shield className="w-12 h-12 text-purple-700 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-purple-950">Administrator Access Required</h2>
            <p className="text-xs text-purple-700 leading-relaxed">
              This portal is strictly restricted to platform administrators. Please sign in with your administrative credentials to access this matrix.
            </p>
          </div>
        }
      >
        <AdminPanel />
      </RoleGuard>
    </div>
  );
};

export default Admin;

