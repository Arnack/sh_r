import { CollapsibleTable } from "@/components/ui/collapsible-table";
import { ReactNode } from "react";

interface Project {
  id: number;
  name: string;
  category: string;
  status: string;
  deadline: string;
  budget: number;
}

// Sample data
const projects: Project[] = [
  { id: 1, name: "Website Redesign", category: "Web Development", status: "In Progress", deadline: "2023-12-15", budget: 12000 },
  { id: 2, name: "Mobile App", category: "App Development", status: "Planning", deadline: "2024-03-20", budget: 45000 },
  { id: 3, name: "E-commerce Platform", category: "Web Development", status: "Completed", deadline: "2023-10-10", budget: 30000 },
  { id: 4, name: "CRM Integration", category: "Integration", status: "In Progress", deadline: "2024-01-25", budget: 18000 },
  { id: 5, name: "Content Management System", category: "Web Development", status: "Testing", deadline: "2023-11-30", budget: 22000 },
  { id: 6, name: "AI Chatbot", category: "AI/ML", status: "Planning", deadline: "2024-04-15", budget: 35000 },
  { id: 7, name: "Data Analytics Dashboard", category: "Data", status: "In Progress", deadline: "2024-02-10", budget: 26000 },
];

// Basic columns
const basicColumns = [
  { header: "Project Name", accessorKey: "name" as const },
  { header: "Category", accessorKey: "category" as const },
  { header: "Status", accessorKey: "status" as const },
];

// Columns with custom cell rendering
const advancedColumns = [
  { header: "Project Name", accessorKey: "name" as const },
  { header: "Category", accessorKey: "category" as const },
  { header: "Status", accessorKey: "status" as const },
  { header: "Deadline", accessorKey: "deadline" as const },
  {
    header: "Budget",
    accessorKey: "budget" as const,
    cell: (value: string | number, row: Project): ReactNode => {
      if (typeof value === "number") {
        return `$${value.toLocaleString()}`;
      }
      return value;
    },
  },
];

export default function TableExample() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Basic Table</h2>
        <CollapsibleTable data={projects} columns={basicColumns} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Grouped by Category</h2>
        <CollapsibleTable
          data={projects}
          columns={basicColumns}
          groupBy="category"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Advanced Table with Custom Cell Rendering</h2>
        <CollapsibleTable
          data={projects}
          columns={advancedColumns}
          groupBy="category"
        />
      </div>
    </div>
  );
} 