import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] bg-red-500/90 text-white text-xs text-center py-1.5">
      Sin conexión a internet — algunos cambios podrían no guardarse.
    </div>
  );
}
