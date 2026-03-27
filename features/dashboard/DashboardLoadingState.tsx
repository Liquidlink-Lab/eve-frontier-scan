"use client";

import { Box, Skeleton, Stack } from "@mui/material";

export default function DashboardLoadingState() {
  return (
    <Box
      role="status"
      aria-label="Loading dashboard view"
      aria-live="polite"
      sx={{
        px: 3,
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Box
          data-testid="dashboard-loading-navigation"
          sx={{
            borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
            pb: 2,
          }}
        >
          <Skeleton
            variant="text"
            width={260}
            height={22}
            sx={{ bgcolor: "rgba(148, 163, 184, 0.18)" }}
          />
        </Box>
        <Stack data-testid="dashboard-loading-content" spacing={2.5}>
          <Skeleton
            variant="rounded"
            height={120}
            sx={{ bgcolor: "rgba(148, 163, 184, 0.14)" }}
          />
          <Skeleton
            variant="rounded"
            height={220}
            sx={{ bgcolor: "rgba(148, 163, 184, 0.12)" }}
          />
          <Skeleton
            variant="rounded"
            height={220}
            sx={{ bgcolor: "rgba(148, 163, 184, 0.1)" }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
