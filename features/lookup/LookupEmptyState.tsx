import { Box, Paper, Stack, Typography } from "@mui/material";

import LinkButton from "@/features/navigation/LinkButton";

export default function LookupEmptyState() {
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
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 5 },
          textAlign: "center",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h4">
            No EVE Frontier player record found for this address.
          </Typography>
          <Typography color="text.secondary">
            This wallet does not currently resolve to a tracked character profile.
          </Typography>
          <LinkButton href="/" variant="outlined">
            Try another address
          </LinkButton>
        </Stack>
      </Paper>
    </Box>
  );
}
