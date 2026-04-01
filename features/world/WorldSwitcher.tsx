"use client";

import type { MouseEvent } from "react";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import { eveWorldOptions, type EveWorld } from "@/lib/eve/env";

interface WorldSwitcherProps {
  label?: string;
  value: EveWorld;
  onChange: (world: EveWorld) => void;
}

export default function WorldSwitcher({
  label = "Server",
  value,
  onChange,
}: WorldSwitcherProps) {
  function handleChange(_: MouseEvent<HTMLElement>, nextWorld: EveWorld | null) {
    if (!nextWorld || nextWorld === value) {
      return;
    }

    onChange(nextWorld);
  }

  return (
    <Stack
      spacing={0.9}
      sx={{
        minWidth: 0,
      }}
    >
      <Typography
        component="p"
        sx={{
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        onChange={handleChange}
        aria-label={`Select ${label}`}
        fullWidth
        sx={{
          "& .MuiToggleButton-root": {
            flex: 1,
            borderColor: "rgba(148, 163, 184, 0.18)",
            color: "text.secondary",
            textTransform: "none",
          },
          "& .Mui-selected": {
            color: "text.primary",
          },
        }}
      >
        {eveWorldOptions.map((world) => (
          <ToggleButton key={world.id} value={world.id} aria-label={world.label}>
            {world.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
