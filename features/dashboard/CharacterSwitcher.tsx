"use client";

import { ChangeEvent } from "react";
import { FormControl, FormLabel, NativeSelect } from "@mui/material";
import { useRouter } from "next/navigation";

import { buildDashboardNetworkNodesHref } from "@/lib/eve/routes";
import type { CharacterSummary, WalletAccessContext } from "@/lib/eve/types";

interface CharacterSwitcherProps {
  access: WalletAccessContext | null;
  characters: CharacterSummary[];
  currentCharacterId: string;
  onNavigate?: () => void;
}

export default function CharacterSwitcher({
  access,
  characters,
  currentCharacterId,
  onNavigate,
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

    onNavigate?.();
    router.push(buildDashboardNetworkNodesHref(nextCharacterId, access));
  }

  return (
    <FormControl fullWidth size="small" disabled={!access || characters.length === 0}>
      <FormLabel
        htmlFor="dashboard-character-switcher"
        sx={{
          mb: 0.75,
          color: "text.secondary",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Character
      </FormLabel>
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
