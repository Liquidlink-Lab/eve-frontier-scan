"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

import { normalizeSuiAddress } from "@/lib/eve/address";

export default function LookupEntryForm() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedAddress = normalizeSuiAddress(address);

    if (!normalizedAddress) {
      return;
    }

    router.push(`/lookup/${normalizedAddress}`);
  }

  return (
    <Stack component="form" spacing={1.5} onSubmit={handleSubmit}>
      <TextField
        label="SUI address"
        name="address"
        placeholder="0x..."
        fullWidth
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <Button type="submit" variant="contained" size="large" fullWidth>
        Inspect wallet
      </Button>
    </Stack>
  );
}
