"use client";

import { useUser, UserProvider } from "@/lib/user-context";
import { UserSelection } from "./UserSelection";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppWrapper>{children}</AppWrapper>
    </UserProvider>
  );
}

function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!user) {
    return <UserSelection />;
  }

  return <>{children}</>;
}
