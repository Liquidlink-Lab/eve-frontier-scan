import { Box, Typography } from "@mui/material";

interface TypeIconProps {
  iconUrl?: string | null;
  label: string;
  size?: number;
  desktopSize?: number;
}

export default function TypeIcon({
  iconUrl,
  label,
  size = 32,
  desktopSize,
}: TypeIconProps) {
  const fallbackLabel = `${label} icon fallback`;
  const responsiveSizeSx = desktopSize
    ? {
        "@media (min-width:600px)": {
          width: desktopSize,
          height: desktopSize,
        },
      }
    : null;

  if (iconUrl) {
    return (
      <Box
        component="img"
        src={iconUrl}
        alt={`${label} icon`}
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          display: "block",
          objectFit: "cover",
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          ...responsiveSizeSx,
        }}
      />
    );
  }

  return (
    <Box
      aria-label={fallbackLabel}
      role="img"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
        color: "text.secondary",
        ...responsiveSizeSx,
      }}
    >
      <Typography
        variant="caption"
        component="span"
        sx={{ fontWeight: 700, lineHeight: 1, letterSpacing: 0.6 }}
      >
        {buildMonogram(label)}
      </Typography>
    </Box>
  );
}

function buildMonogram(label: string) {
  const normalized = label.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (normalized.length === 0) {
    return "??";
  }

  return normalized.slice(0, 2);
}
