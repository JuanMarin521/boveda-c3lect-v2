import { Outlet } from 'react-router';
import { Suspense } from 'react';
import OfflineBanner from '../components/OfflineBanner';

export default function AdminRoot() {
  return (
    <>
      <OfflineBanner />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}
