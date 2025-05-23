"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getGroupedRowModel,
  GroupingState,
  getExpandedRowModel,
  ExpandedState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Filter } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  groupingOptions?: string[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  groupingOptions = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [areAllExpanded, setAreAllExpanded] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)

  const handleGroupingChange = (field: string | null, level: number) => {
    const newGrouping = [...grouping]
    if (field === null) {
      if (level === 0) {
        setGrouping([])
      } else {
        newGrouping.splice(level, 1)
        setGrouping(newGrouping)
      }
    } else {
      if (level === 0) {
        setGrouping([field])
      } else {
        newGrouping[level] = field
        setGrouping(newGrouping)
      }
    }
    setExpanded({})
    setAreAllExpanded(false)
  }

  const currentGrouping = grouping[0] || null
  const secondaryGrouping = grouping[1] || null

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableGrouping: true,
    enableExpanding: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      grouping,
      globalFilter,
      expanded,
    },
    onExpandedChange: setExpanded,
  })

  const toggleAllExpanded = () => {
    if (areAllExpanded) {
      setExpanded({})
      setAreAllExpanded(false)
    } else {
      const newExpanded: ExpandedState = {}
      table.getRowModel().rows.forEach(row => {
        if (row.getCanExpand()) {
          newExpanded[row.id] = true
        }
      })
      setExpanded(newExpanded)
      setAreAllExpanded(true)
    }
  }

  // Effect to expand at least the first row after grouping changes
  React.useEffect(() => {
    if (grouping.length > 0 && table.getRowModel().rows.length > 0) {
      const firstRow = table.getRowModel().rows[0]; 
      if (firstRow && firstRow.getCanExpand()) {
        const newExpanded: ExpandedState = {};
        newExpanded[firstRow.id] = true;
        setExpanded(newExpanded);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grouping]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Фильтровать все столбцы..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {currentGrouping && (
            <Button 
              variant="outline" 
              onClick={toggleAllExpanded}
              className="mr-2"
            >
              {areAllExpanded ? "Свернуть все" : "Развернуть все"}
            </Button>
          )}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Колонки <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" && column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === 'vidDeyatelnosti' ? 'Вид деятельности' : column.id === 'kod' ? 'Код' : column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {currentGrouping ? `Группировка: ${currentGrouping === 'vidDeyatelnosti' ? 'Вид деятельности' : 'Код'}` : "Группировать"} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleGroupingChange(null, 0)}>
                  Нет
                </DropdownMenuItem>
                {groupingOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleGroupingChange(option, 0)}
                  >
                    {option === 'vidDeyatelnosti' ? 'Вид деятельности' : 'Код'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {currentGrouping && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {secondaryGrouping ? `Подгруппа: ${secondaryGrouping === 'vidDeyatelnosti' ? 'Вид деятельности' : 'Код'}` : "Подгруппа"} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleGroupingChange(null, 1)}>
                    Нет
                  </DropdownMenuItem>
                  {groupingOptions
                    .filter(option => option !== currentGrouping)
                    .map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => handleGroupingChange(option, 1)}
                      >
                        {option === 'vidDeyatelnosti' ? 'Вид деятельности' : 'Код'}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <TableRow>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1">
                            <div
                              className={`flex items-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                desc: <ArrowDown className="ml-2 h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
                {showFilters && (
                  <TableRow>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.column.getCanFilter() ? (
                            <Input
                              placeholder={`Фильтр...`}
                              value={(header.column.getFilterValue() as string) ?? ""}
                              onChange={(event) =>
                                header.column.setFilterValue(event.target.value)
                              }
                              className="h-8"
                            />
                          ) : null}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.getIsGrouped() ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              row.toggleExpanded();
                              setAreAllExpanded(false);
                            }}
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          <span className="ml-2">
                            ({row.subRows.length})
                          </span>
                        </div>
                      ) : cell.getIsAggregated() ? (
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Нет результатов.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Display active filters */}
      {(globalFilter || columnFilters.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          <span>Активные фильтры:</span>
          {globalFilter && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
              <span>Все колонки: {globalFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => setGlobalFilter("")}
              >
                ×
              </Button>
            </div>
          )}
          {columnFilters.map((filter) => {
            const column = table.getColumn(filter.id);
            if (!column) return null;
            return (
              <div key={filter.id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                <span>
                  {column.id === 'vidDeyatelnosti' ? 'Вид деятельности' : 
                   column.id === 'code' ? 'Код' : column.id}: {String(filter.value)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => column.setFilterValue("")}
                >
                  ×
                </Button>
              </div>
            );
          })}
        </div>
      )}
      
      {currentGrouping && (
        <div className="text-sm text-muted-foreground mt-2">
          <p>Группировка: {currentGrouping === 'vidDeyatelnosti' ? 'Вид деятельности' : 'Код'}</p>
          {secondaryGrouping && (
            <p>Подгруппа: {secondaryGrouping === 'vidDeyatelnosti' ? 'Вид деятельности' : 'Код'}</p>
          )}
        </div>
      )}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Далее
        </Button>
      </div>
    </div>
  )
} 