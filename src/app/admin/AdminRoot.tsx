import { Outlet } from 'react-router';
import { Suspense } from 'react';

export default function AdminRoot() {
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
