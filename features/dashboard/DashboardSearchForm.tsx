"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

import { normalizeSuiAddress } from "@/lib/eve/address";
import type { EveWorld } from "@/lib/eve/env";
import { buildLookupHref } from "@/lib/eve/routes";

interface DashboardSearchFormProps {
  world: EveWorld;
}

export default function DashboardSearchForm({
  world,
}: DashboardSearchFormProps) {
  const router = useRouter();
  const [address, setAddress] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedAddress = normalizeSuiAddress(address);

    if (!normalizedAddress) {
      return;
    }

    router.push(buildLookupHref(normalizedAddress, world));
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
        label="Inspect another address"
        name="dashboard-address"
        placeholder="0x..."
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
          "& .MuiInputLabel-root": {
            display: { xs: "none", md: "block" },
          },
          "& .MuiOutlinedInput-root": {
            minHeight: { xs: 40, md: 44 },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="small"
        aria-label="Inspect another address"
        sx={{
          width: { xs: 40, md: "auto" },
          minWidth: { xs: 40, md: 96 },
          height: 40,
          flexShrink: 0,
          px: { xs: 0, md: 2.5 },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "inline-flex", md: "none" }, alignItems: "center" }}
        >
          <SearchRoundedIcon fontSize="small" />
        </Box>
        <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
          Inspect
        </Box>
      </Button>
    </Stack>
  );
}
