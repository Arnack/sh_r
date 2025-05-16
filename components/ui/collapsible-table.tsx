import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface CollapsibleTableProps<T> {
  data: T[];
  columns: Column<T>[];
  groupBy?: keyof T;
  className?: string;
}

export function CollapsibleTable<T extends Record<string, any>>({
  data,
  columns,
  groupBy,
  className,
}: CollapsibleTableProps<T>) {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const groupedData = React.useMemo(() => {
    if (!groupBy) return [{ key: "default", items: data }];

    const groups = data.reduce((acc, item) => {
      const groupKey = String(item[groupBy]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, T[]>);

    return Object.entries(groups).map(([key, items]) => ({
      key,
      items,
    }));
  }, [data, groupBy]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {groupBy && <th className="w-10 p-2 text-left"></th>}
            {columns.map((column, index) => (
              <th key={index} className="p-2 text-left font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedData.map((group) => (
            <React.Fragment key={group.key}>
              {groupBy && (
                <tr className="border-b bg-muted/50">
                  <td className="p-2">
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted"
                    >
                      {expandedGroups.has(group.key) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td colSpan={columns.length} className="p-2 font-medium">
                    {group.key}
                  </td>
                </tr>
              )}
              {(!groupBy || expandedGroups.has(group.key)) &&
                group.items.map((item, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {groupBy && <td className="p-2"></td>}
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-2">
                        {column.cell
                          ? column.cell(item[column.accessorKey], item)
                          : String(item[column.accessorKey])}
                      </td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
} 