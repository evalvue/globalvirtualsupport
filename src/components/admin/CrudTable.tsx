import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Col<T> = { header: string; render: (row: T) => ReactNode; className?: string };

const CrudTable = <T extends { id: string }>({
  rows,
  columns,
  empty = "No records yet.",
}: {
  rows: T[];
  columns: Col<T>[];
  empty?: string;
}) => {
  if (!rows.length) return <div className="text-muted-foreground text-sm py-8 text-center">{empty}</div>;
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.header} className={c.className}>{c.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              {columns.map((c) => (
                <TableCell key={c.header} className={c.className}>{c.render(r)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CrudTable;