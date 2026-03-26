"use client";

import { Button } from "@mui/material";

import { useWalletSession } from "@/features/wallet/useWalletSession";

interface ConnectWalletButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export default function ConnectWalletButton({
  disabled = false,
  onClick,
}: ConnectWalletButtonProps) {
  const walletSession = useWalletSession();
  const isDisabled = disabled || !walletSession.hasEveVault;
  const handleClick = onClick ?? walletSession.connect;

  return (
    <Button
      variant="outlined"
      size="large"
      fullWidth
      disabled={isDisabled}
      onClick={handleClick}
    >
      Connect EVE Vault
    </Button>
  );
}
