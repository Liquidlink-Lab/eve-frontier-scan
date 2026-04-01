"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

import { normalizeSuiAddress } from "@/lib/eve/address";
import type { EveWorld } from "@/lib/eve/env";
import { buildLookupHref } from "@/lib/eve/routes";
import WorldSwitcher from "@/features/world/WorldSwitcher";

interface LookupEntryFormProps {
  defaultWorld: EveWorld;
}

export default function LookupEntryForm({
  defaultWorld,
}: LookupEntryFormProps) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [selectedWorld, setSelectedWorld] = useState(defaultWorld);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedAddress = normalizeSuiAddress(address);

    if (!normalizedAddress) {
      return;
    }

    router.push(buildLookupHref(normalizedAddress, selectedWorld));
  }

  return (
    <Stack component="form" spacing={1.5} onSubmit={handleSubmit}>
      <WorldSwitcher value={selectedWorld} onChange={setSelectedWorld} />
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
