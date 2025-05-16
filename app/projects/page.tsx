"use client"

import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for projects
const projectsData = [
  {
    id: "PRJ001",
    name: "Website Redesign",
    status: "Completed",
    priority: "High",
    deadline: "2023-12-15",
    progress: 100,
    client: "Acme Corp",
    budget: 15000,
  },
  {
    id: "PRJ002",
    name: "Mobile App Development",
    status: "In Progress",
    priority: "High",
    deadline: "2024-03-30",
    progress: 65,
    client: "TechStart Inc",
    budget: 45000,
  },
  {
    id: "PRJ003",
    name: "Marketing Campaign",
    status: "In Progress",
    priority: "Medium",
    deadline: "2024-02-28",
    progress: 40,
    client: "Global Retail",
    budget: 12000,
  },
  {
    id: "PRJ004",
    name: "Database Migration",
    status: "On Hold",
    priority: "Low",
    deadline: "2024-04-15",
    progress: 20,
    client: "FinServe Ltd",
    budget: 8000,
  },
  {
    id: "PRJ005",
    name: "CRM Implementation",
    status: "Not Started",
    priority: "Medium",
    deadline: "2024-05-01",
    progress: 0,
    client: "Healthcare Plus",
    budget: 30000,
  },
  {
    id: "PRJ006",
    name: "Security Audit",
    status: "Completed",
    priority: "High",
    deadline: "2023-11-30",
    progress: 100,
    client: "BankSecure",
    budget: 22000,
  },
  {
    id: "PRJ007",
    name: "Content Strategy",
    status: "In Progress",
    priority: "Low",
    deadline: "2024-02-15",
    progress: 75,
    client: "Media Group",
    budget: 7500,
  },
  {
    id: "PRJ008",
    name: "E-commerce Platform",
    status: "In Progress",
    priority: "High",
    deadline: "2024-06-30",
    progress: 30,
    client: "Retail Chain",
    budget: 60000,
  },
]

type SortConfig = {
  key: keyof (typeof projectsData)[0] | null
  direction: "asc" | "desc"
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" })

  // Handle sorting
  const requestSort = (key: keyof (typeof projectsData)[0]) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted and filtered data
  const getSortedProjects = () => {
    const filteredProjects = projectsData.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (sortConfig.key) {
      return [...filteredProjects].sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return filteredProjects
  }

  const sortedProjects = getSortedProjects()

  // Render sort indicator
  const renderSortIndicator = (key: keyof (typeof projectsData)[0]) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    )
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
      case "In Progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
      case "On Hold":
        return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>
      case "Not Started":
        return (
          <Badge variant="outline">
            <XCircle className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your projects and track their progress</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Filter projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => requestSort("name")}>
                      <div className="flex items-center">
                        Project Name
                        {renderSortIndicator("name")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort("client")}>
                      <div className="flex items-center">
                        Client
                        {renderSortIndicator("client")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort("status")}>
                      <div className="flex items-center">
                        Status
                        {renderSortIndicator("status")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort("priority")}>
                      <div className="flex items-center">
                        Priority
                        {renderSortIndicator("priority")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort("deadline")}>
                      <div className="flex items-center">
                        Deadline
                        {renderSortIndicator("deadline")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => requestSort("budget")}>
                      <div className="flex items-center">
                        Budget
                        {renderSortIndicator("budget")}
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Progress</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.length > 0 ? (
                    sortedProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{renderStatusBadge(project.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">{project.priority}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">${project.budget.toLocaleString()}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit project</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Archive project</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No projects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
