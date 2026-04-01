import MyDashboardEntryPage from "@/features/dashboard/MyDashboardEntryPage";
import { parseEveWorld } from "@/lib/eve/env";

interface MyDashboardPageProps {
  searchParams: Promise<{
    world?: string;
  }>;
}

export default async function MyDashboardPage({
  searchParams,
}: MyDashboardPageProps) {
  const { world } = await searchParams;

  return <MyDashboardEntryPage world={parseEveWorld(world)} />;
}
