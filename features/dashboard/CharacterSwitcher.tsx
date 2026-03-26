"use client";

import { ChangeEvent } from "react";
import { FormControl, InputLabel, NativeSelect } from "@mui/material";
import { useRouter } from "next/navigation";

import { buildDashboardNetworkNodesHref } from "@/lib/eve/routes";
import type { CharacterSummary, WalletAccessContext } from "@/lib/eve/types";

interface CharacterSwitcherProps {
  access: WalletAccessContext | null;
  characters: CharacterSummary[];
  currentCharacterId: string;
}

export default function CharacterSwitcher({
  access,
  characters,
  currentCharacterId,
}: CharacterSwitcherProps) {
  const router = useRouter();
  const selectedCharacterId = characters.some(
    (character) => character.id === currentCharacterId,
  )
    ? currentCharacterId
    : "";

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    if (!access) {
      return;
    }

    const nextCharacterId = event.target.value;

    if (!nextCharacterId || nextCharacterId === currentCharacterId) {
      return;
    }

    router.push(buildDashboardNetworkNodesHref(nextCharacterId, access));
  }

  return (
    <FormControl fullWidth size="small" disabled={!access || characters.length === 0}>
      <InputLabel variant="standard" htmlFor="dashboard-character-switcher">
        Character
      </InputLabel>
      <NativeSelect
        value={selectedCharacterId}
        inputProps={{
          id: "dashboard-character-switcher",
          "aria-label": "Character",
        }}
        onChange={handleChange}
      >
        {selectedCharacterId === "" ? <option value="">Select character</option> : null}
        {characters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}
