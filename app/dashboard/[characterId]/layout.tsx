import type { PropsWithChildren } from "react";

import DashboardShell from "@/features/dashboard/DashboardShell";

interface CharacterDashboardLayoutProps extends PropsWithChildren {
  params: Promise<{
    characterId: string;
  }>;
}

export default async function CharacterDashboardLayout({
  children,
  params,
}: CharacterDashboardLayoutProps) {
  const { characterId } = await params;

  return <DashboardShell characterId={characterId}>{children}</DashboardShell>;
}
