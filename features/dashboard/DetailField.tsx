import type { PropsWithChildren } from "react";
import { Box, Stack, Typography } from "@mui/material";

interface DetailFieldProps extends PropsWithChildren {
  label: string;
  alignTop?: boolean;
}

export default function DetailField({
  children,
  label,
  alignTop = false,
}: DetailFieldProps) {
  return (
    <Stack
      data-testid="dashboard-detail-field"
      spacing={1}
      sx={{
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        "@media (min-width:600px)": {
          flexDirection: "row",
          alignItems: alignTop ? "flex-start" : "center",
        },
      }}
    >
      <Typography color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Box
        data-testid="dashboard-detail-field-value"
        sx={{
          width: "100%",
          minWidth: 0,
          display: "flex",
          justifyContent: "flex-start",
          textAlign: "left",
          wordBreak: "break-word",
          "@media (min-width:600px)": {
            justifyContent: "flex-end",
            textAlign: "right",
          },
          "& > *": {
            maxWidth: "100%",
          },
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
