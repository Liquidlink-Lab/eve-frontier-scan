import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { AssemblySummary, WalletAccessContext } from "@/lib/eve/types";
import AssemblyRow from "./AssemblyRow";

interface AssemblyGroupSectionProps {
  access: WalletAccessContext;
  characterId: string;
  groupLabel: string;
  assemblies: AssemblySummary[];
}

export default function AssemblyGroupSection({
  access,
  characterId,
  groupLabel,
  assemblies,
}: AssemblyGroupSectionProps) {
  return (
    <section>
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        {groupLabel}
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid rgba(148, 163, 184, 0.16)",
          backgroundColor: "rgba(8, 11, 17, 0.88)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Solar System</TableCell>
              <TableCell aria-label="Actions" />
            </TableRow>
          </TableHead>
          <TableBody>
            {assemblies.map((assembly) => (
              <AssemblyRow
                key={assembly.id}
                access={access}
                characterId={characterId}
                assembly={assembly}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
