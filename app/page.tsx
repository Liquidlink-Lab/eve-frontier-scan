import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import BrandLogo from "@/features/brand/BrandLogo";
import ConnectWalletButton from "@/features/home/ConnectWalletButton";
import HomeWalletRedirect from "@/features/home/HomeWalletRedirect";
import LookupEntryForm from "@/features/home/LookupEntryForm";

const homeCapabilityLabels = [
  "Wallet lookup",
  "Character dashboard",
  "Structure tracing",
];

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        px: 3,
        py: { xs: 6, md: 10 },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(154, 199, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(154, 199, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(circle at center, rgba(0, 0, 0, 1), transparent 82%)",
          pointerEvents: "none",
        },
      }}
    >
      <HomeWalletRedirect />
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: 560,
          px: { xs: 3, sm: 5.5 },
          py: { xs: 4, sm: 5.5 },
          borderRadius: 4,
          backgroundColor: "rgba(8, 13, 20, 0.84)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 24px 60px rgba(2, 6, 12, 0.38)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(191, 24, 49, 0.12), transparent 28%)",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(191, 24, 49, 0), rgba(191, 24, 49, 0.9), rgba(154, 199, 255, 0.22), rgba(191, 24, 49, 0))",
          },
        }}
      >
        <Stack spacing={3.5} sx={{ position: "relative" }}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <BrandLogo priority size={88} />
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
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 460,
                fontSize: { xs: "0.98rem", sm: "1.02rem" },
                lineHeight: 1.7,
              }}
            >
              Inspect SUI wallet ownership, characters, network nodes,
              assemblies, and gates from a single entry point.
            </Typography>
            <Stack
              direction="row"
              useFlexGap
              flexWrap="wrap"
              justifyContent="center"
              gap={1}
            >
              {homeCapabilityLabels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(154, 199, 255, 0.16)",
                    backgroundColor: "rgba(14, 22, 34, 0.74)",
                    color: "text.secondary",
                    letterSpacing: "0.02em",
                  }}
                />
              ))}
            </Stack>
          </Stack>
          <LookupEntryForm />
          <ConnectWalletButton />
        </Stack>
      </Paper>
    </Box>
  );
}
