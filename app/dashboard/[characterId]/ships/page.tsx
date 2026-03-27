import { Box, Paper, Stack, Typography } from "@mui/material";

export default function DashboardShipsPage() {
  return (
    <Box component="main" sx={{ flex: 1, px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}>
      <Paper elevation={0} sx={{ maxWidth: 960, mx: "auto", px: { xs: 3, sm: 4 }, py: { xs: 4, sm: 5 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h3">Ships</Typography>
          <Typography color="text.secondary">
            Ship-specific detail views are not part of this MVP yet.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
