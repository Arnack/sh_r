"use client"

import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the type for our data
type Person = {
  id: string
  name: string
  email: string
  department: string
  role: string
  salary: number
}

// Sample data
const data: Person[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    department: "Engineering",
    role: "Senior Developer",
    salary: 120000,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Marketing",
    role: "Marketing Manager",
    salary: 95000,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    department: "Engineering",
    role: "Junior Developer",
    salary: 75000,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    department: "Sales",
    role: "Sales Representative",
    salary: 85000,
  },
]

// Define columns
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Salary
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const salary = parseFloat(row.getValue("salary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(salary)
      return formatted
    },
  },
]

// Grouping options
const groupingOptions = ["department", "role"]

export default function ExampleTable() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Employee Data Table</h1>
      <DataTable
        columns={columns}
        data={data}
        groupingOptions={groupingOptions}
      />
    </div>
  )
} 