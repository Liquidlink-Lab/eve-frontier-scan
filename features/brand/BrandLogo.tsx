import Image from "next/image";
import { Box } from "@mui/material";

interface BrandLogoProps {
  priority?: boolean;
  size?: number;
}

export default function BrandLogo({
  priority = false,
  size = 72,
}: BrandLogoProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(191, 24, 49, 0.42)",
      }}
    >
      <Image
        src="/brand/eve-frontier-scan-logo.jpg"
        alt="EVE Frontier Scan logo"
        width={size}
        height={size}
        priority={priority}
        unoptimized
        sizes={`${size}px`}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
