'use client'

// import Autocomplete from "@/components/autocomplete"
import Autocomplete from "@/components/acml3"
import { InputWithHistory } from "@/components/inputWithHistory"
import { DataTable } from "@/components/DataTable2"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef } from "@tanstack/react-table"

const entities = [
    { code: "Acm Bs Corp", name: "Acme Business Corp" },
    { code: "Bcd Dev", name: "Blue Cloud Development" },
    { code: "Cde Ent", name: "Creative Digital Enterprises" },
    { code: "Def Frm", name: "Dynamic Engineering Firm" },
    { code: "Efg Fin", name: "Evergreen Financial Group" },
    { code: "Fgh Hld", name: "Future Growth Holdings" },
    { code: "Ghi Ind", name: "Global Healthcare Industries" },
    { code: "Hij Inj", name: "Horizon Innovation Junction" },
    { code: "Ijk Inf", name: "Infinite Journey Knowledge" },
    { code: "Jkl Log", name: "Jade Kingdom Logistics" },
    { code: "Klm Log", name: "Knightly Logistics" },
    { code: "Lmn Log", name: "Luminous Logistics" },
    { code: "Mno Log", name: "Mega Logistics" },
    { code: "Nop Log", name: "Nexus Logistics" },
    { code: "Opq Log", name: "Orion Logistics" },
    { code: "Pqr Log", name: "Pioneer Logistics" },
    { code: "Rst Log", name: "Quantum Logistics" },
    { code: "Stu Log", name: "Sky Logistics" },
    { code: "Tuv Log", name: "Titan Logistics" },
]

// Project-related data
const projects = [
    { id: "PRJ001", code: "УД-123/2024", nachalo: "2024-05-01", vidDeyatelnosti: "Уголовное дело", tema: "Мошенничество в особо крупном размере", dlitelnost: "120", okruglenie: "15" },
    { id: "PRJ002", code: "ГД-456/2024", nachalo: "2024-06-15", vidDeyatelnosti: "Гражданское дело", tema: "Взыскание задолженности по договору", dlitelnost: "90", okruglenie: "30" },
    { id: "PRJ003", code: "АД-789/2024", nachalo: "2024-02-10", vidDeyatelnosti: "Административное дело", tema: "Оспаривание штрафа ГИБДД", dlitelnost: "45", okruglenie: "15" },
    { id: "PRJ004", code: "УД-234/2024", nachalo: "2024-04-20", vidDeyatelnosti: "Уголовное дело", tema: "Нарушение правил дорожного движения", dlitelnost: "180", okruglenie: "30" },
    { id: "PRJ005", code: "ГД-567/2024", nachalo: "2024-03-01", vidDeyatelnosti: "Гражданское дело", tema: "Раздел имущества при разводе", dlitelnost: "150", okruglenie: "15" },
    { id: "PRJ006", code: "АД-890/2024", nachalo: "2024-01-15", vidDeyatelnosti: "Административное дело", tema: "Обжалование действий должностного лица", dlitelnost: "60", okruglenie: "15" },
    { id: "PRJ007", code: "УД-345/2024", nachalo: "2024-07-01", vidDeyatelnosti: "Уголовное дело", tema: "Кража со взломом", dlitelnost: "210", okruglenie: "30" },
    { id: "PRJ008", code: "ГД-678/2024", nachalo: "2024-05-15", vidDeyatelnosti: "Гражданское дело", tema: "Защита прав потребителей", dlitelnost: "75", okruglenie: "15" },
    { id: "PRJ009", code: "АД-901/2024", nachalo: "2024-06-01", vidDeyatelnosti: "Административное дело", tema: "Нарушение правил торговли", dlitelnost: "30", okruglenie: "15" },
    { id: "PRJ010", code: "УД-456/2024", nachalo: "2024-04-01", vidDeyatelnosti: "Уголовное дело", tema: "Хулиганство", dlitelnost: "90", okruglenie: "30" },
]

type Entity = {
  code: string
  name: string
}

type Project = {
  id: string
  code: string
  nachalo: string
  vidDeyatelnosti: string
  tema: string
  dlitelnost: string
  okruglenie: string
}

const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]

const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "nachalo",
    header: "Начало",
  },
  {
    accessorKey: "code",
    header: "Код Проекта",
  },
  {
    accessorKey: "vidDeyatelnosti",
    header: "Вид Деятельности",
  },
  {
    accessorKey: "tema",
    header: "Тема",
  },
  {
    accessorKey: "dlitelnost",
    header: "Длительность",
  },
  {
    accessorKey: "okruglenie",
    header: "Округление",
  },
]

export default function DemoPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl space-y-4">
        <Tabs defaultValue="autocomplete" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="autocomplete">Автокомплит</TabsTrigger>
            <TabsTrigger value="input">Автоподстановка</TabsTrigger>
            <TabsTrigger value="projects">Грид</TabsTrigger>
          </TabsList>
          
          <TabsContent value="autocomplete" className="mt-6">
            <div className="w-full space-y-4">
              <Autocomplete 
                data={entities} 
                onSelect={() => {}} 
                placeholder="Поиск по коду или названию"
              />
            </div>
          </TabsContent>

          <TabsContent value="input" className="mt-6">
            <div className="w-full space-y-4">
              <InputWithHistory 
                onSubmit={() => {}} 
                placeholder="Поиск по коду или названию"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <div className="w-full space-y-4">
              <DataTable 
                columns={projectColumns} 
                data={projects}
                groupingOptions={["vidDeyatelnosti", "code"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
