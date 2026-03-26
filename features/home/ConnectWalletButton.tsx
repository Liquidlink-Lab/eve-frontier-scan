"use client";

import { Button } from "@mui/material";

interface ConnectWalletButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export default function ConnectWalletButton({
  disabled = false,
  onClick,
}: ConnectWalletButtonProps) {
  return (
    <Button
      variant="outlined"
      size="large"
      fullWidth
      disabled={disabled}
      onClick={onClick}
    >
      Connect EVE Vault
    </Button>
  );
}
