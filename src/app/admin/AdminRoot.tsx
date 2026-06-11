import { Outlet } from 'react-router';
import { Suspense } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function AdminRoot() {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  );
}
