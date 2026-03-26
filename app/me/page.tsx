import { Box, Paper, Stack, Typography } from "@mui/material";

export default function MyDashboardEntryPage() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        px: 3,
        py: 8,
      }}
    >
      <Paper elevation={0} sx={{ maxWidth: 560, px: 4, py: 5 }}>
        <Stack spacing={1.5}>
          <Typography variant="h4">My dashboard</Typography>
          <Typography color="text.secondary">
            Connect EVE Vault from the top-right wallet control to resolve your
            linked characters.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
