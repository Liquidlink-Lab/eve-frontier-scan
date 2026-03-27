import { Chip, TableCell, TableRow, Typography } from "@mui/material";

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
        <Typography fontWeight={600}>{assembly.name}</Typography>
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
