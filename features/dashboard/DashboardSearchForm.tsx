"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Button, Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

import { normalizeSuiAddress } from "@/lib/eve/address";

export default function DashboardSearchForm() {
  const theme = useTheme();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const isCompactMobile = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedAddress = normalizeSuiAddress(address);

    if (!normalizedAddress) {
      return;
    }

    router.push(`/lookup/${normalizedAddress}`);
  }

  return (
    <Stack
      component="form"
      direction="row"
      alignItems="stretch"
      spacing={1}
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 720, mx: "auto" }}
    >
      <TextField
        hiddenLabel={isCompactMobile}
        label={isCompactMobile ? undefined : "Inspect another address"}
        name="dashboard-address"
        placeholder={isCompactMobile ? "Address" : "0x..."}
        inputProps={{
          "aria-label": "Inspect another address",
        }}
        fullWidth
        size="small"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        sx={{
          minWidth: 0,
          flex: 1,
          "& .MuiOutlinedInput-root": {
            minHeight: isCompactMobile ? 40 : 44,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size={isCompactMobile ? "small" : "medium"}
        aria-label={isCompactMobile ? "Inspect address" : undefined}
        sx={{
          width: isCompactMobile ? 40 : "auto",
          minWidth: isCompactMobile ? 40 : 96,
          height: isCompactMobile ? 40 : undefined,
          flexShrink: 0,
          px: isCompactMobile ? 0 : { xs: 2, sm: 2.5 },
        }}
      >
        {isCompactMobile ? <SearchRoundedIcon fontSize="small" /> : "Inspect"}
      </Button>
    </Stack>
  );
}
