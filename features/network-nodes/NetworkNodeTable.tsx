import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import type {
  NetworkNodeSummary,
  WalletAccessContext,
} from "@/lib/eve/types";
import NetworkNodeTableRow from "./NetworkNodeTableRow";

interface NetworkNodeTableProps {
  access: WalletAccessContext;
  characterId: string;
  networkNodes: NetworkNodeSummary[];
}

const columns = [
  "Status",
  "Name",
  "Solar System",
  "Fuel",
  "Connected Assemblies",
] as const;

export default function NetworkNodeTable({
  access,
  characterId,
  networkNodes,
}: NetworkNodeTableProps) {
  return (
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
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
            <TableCell aria-label="Actions" />
          </TableRow>
        </TableHead>
        <TableBody>
          {networkNodes.map((networkNode) => (
            <NetworkNodeTableRow
              key={networkNode.id}
              access={access}
              characterId={characterId}
              networkNode={networkNode}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
