import { Chip, Stack, TableCell, TableRow, Typography } from "@mui/material";

import TypeIcon from "@/features/icons/TypeIcon";
import LinkButton from "@/features/navigation/LinkButton";
import { buildDashboardAssemblyDetailHref } from "@/lib/eve/routes";
import type { AssemblySummary, WalletAccessContext } from "@/lib/eve/types";

interface AssemblyRowProps {
  access: WalletAccessContext;
  characterId: string;
  assembly: AssemblySummary;
}

export default function AssemblyRow({
  access,
  characterId,
  assembly,
}: AssemblyRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Chip
          label={assembly.status}
          color={assembly.status === "online" ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <TypeIcon iconUrl={assembly.iconUrl} label={assembly.typeLabel} size={28} />
          <Typography fontWeight={600}>{assembly.name}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{assembly.systemName ?? "Unknown"}</TableCell>
      <TableCell align="right">
        <LinkButton
          href={buildDashboardAssemblyDetailHref(characterId, assembly.id, access)}
          size="small"
        >
          Details
        </LinkButton>
      </TableCell>
    </TableRow>
  );
}
