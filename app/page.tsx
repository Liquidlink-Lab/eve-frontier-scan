"use client";

import { Box, Button, Stack, TextField } from "@mui/material";

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
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <TextField label="SUI address" name="address" fullWidth />
        <Button variant="outlined" size="large">
          Connect EVE Vault
        </Button>
      </Stack>
    </Box>
  );
}
