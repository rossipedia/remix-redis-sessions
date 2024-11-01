import { Outlet } from '@remix-run/react';

export default function AppLayout() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
