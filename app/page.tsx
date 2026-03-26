import { Box, Paper, Stack, Typography } from "@mui/material";

import ConnectWalletButton from "@/features/home/ConnectWalletButton";
import HomeWalletRedirect from "@/features/home/HomeWalletRedirect";
import LookupEntryForm from "@/features/home/LookupEntryForm";

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        px: 3,
        py: { xs: 6, md: 10 },
      }}
    >
      <HomeWalletRedirect />
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          borderRadius: 4,
          backgroundColor: "rgba(12, 17, 25, 0.8)",
          backdropFilter: "blur(18px)",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography
              component="p"
              sx={{
                fontSize: "0.72rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              EVE Frontier
            </Typography>
            <Typography component="h1" variant="h1">
              EVE Frontier Scan
            </Typography>
          </Stack>
          <LookupEntryForm />
          <ConnectWalletButton />
        </Stack>
      </Paper>
    </Box>
  );
}
