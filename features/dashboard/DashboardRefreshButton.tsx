"use client";

import { useTransition } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DashboardRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outlined"
      size="small"
      color="inherit"
      onClick={handleRefresh}
      disabled={isPending}
      aria-busy={isPending}
      startIcon={
        isPending ? <CircularProgress color="inherit" size={14} /> : undefined
      }
    >
      {isPending ? "Refreshing..." : "Refresh"}
    </Button>
  );
}
