'use client'

// import Autocomplete from "@/components/autocomplete"
import Autocomplete from "@/components/acml3"
import { InputWithHistory } from "@/components/inputWithHistory"
import { DataTable } from "@/components/DataTable2"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as XLSX from 'xlsx'
import { Switch } from "@/components/ui/switch"


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

type ExcelStyleSettings = {
  headerColor: string;
  alternateRows: boolean;
  alternateColor: string;
  borders: boolean;
  numberFormat: boolean;
}

export default function DemoPage() {
  const [projectData, setProjectData] = useState<Project[]>(projects);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    code: '',
    nachalo: '',
    vidDeyatelnosti: 'Уголовное дело',
    tema: '',
    dlitelnost: '',
    okruglenie: '15'
  });
  const [open, setOpen] = useState(false);
  const [excelSettingsOpen, setExcelSettingsOpen] = useState(false);
  const [excelSettings, setExcelSettings] = useState<ExcelStyleSettings>({
    headerColor: '#4F46E5', // Indigo color
    alternateRows: true,
    alternateColor: '#F3F4F6', // Light gray
    borders: true,
    numberFormat: true
  });

  const handleExportXLSX = (data: Project[]) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      'Начало': item.nachalo,
      'Код Проекта': item.code,
      'Вид Деятельности': item.vidDeyatelnosti,
      'Тема': item.tema,
      'Длительность': item.dlitelnost,
      'Округление': item.okruglenie
    })));

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Начало
      { wch: 15 }, // Код Проекта
      { wch: 20 }, // Вид Деятельности
      { wch: 40 }, // Тема
      { wch: 12 }, // Длительность
      { wch: 12 }, // Округление
    ];
    ws['!cols'] = colWidths;

    // Add styling
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    const headerStyle = {
      fill: { fgColor: { rgb: excelSettings.headerColor.replace('#', '') } },
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: excelSettings.borders ? {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      } : undefined
    };

    // Apply header style
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = headerStyle;
    }

    // Apply alternating row colors
    if (excelSettings.alternateRows) {
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        if (R % 2 === 0) continue;
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;
          ws[cellRef].s = {
            fill: { fgColor: { rgb: excelSettings.alternateColor.replace('#', '') } },
            border: excelSettings.borders ? {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            } : undefined
          };
        }
      }
    }

    // Apply number formatting
    if (excelSettings.numberFormat) {
      const numberColumns = ['Длительность', 'Округление'];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const header = ws[XLSX.utils.encode_cell({ r: 0, c: C })].v;
        if (numberColumns.includes(header)) {
          for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellRef]) continue;
            ws[cellRef].z = '#,##0';
          }
        }
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Судебная деятельность");

    // Generate and download the file
    XLSX.writeFile(wb, "судебная_деятельность.xlsx");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      ...formData,
      id: `PRJ${String(projectData.length + 1).padStart(3, '0')}`
    };
    
    setProjectData(prev => [newProject, ...prev]);
    
    // Reset form
    setFormData({
      code: '',
      nachalo: '',
      vidDeyatelnosti: 'Уголовное дело',
      tema: '',
      dlitelnost: '',
      okruglenie: '15'
    });
    
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl space-y-4">
        <Tabs defaultValue="autocomplete" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
              <div className="flex justify-end mb-4 gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      Добавить проект
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Добавить новый проект</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="code">Код проекта</Label>
                          <Input 
                            id="code" 
                            name="code" 
                            value={formData.code} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="ГД-123/2024"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nachalo">Начало</Label>
                          <Input 
                            id="nachalo" 
                            name="nachalo" 
                            type="date" 
                            value={formData.nachalo} 
                            onChange={handleInputChange} 
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vidDeyatelnosti">Вид деятельности</Label>
                        <select 
                          id="vidDeyatelnosti"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.vidDeyatelnosti}
                          onChange={(e) => handleSelectChange('vidDeyatelnosti', e.target.value)}
                        >
                          <option value="Уголовное дело">Уголовное дело</option>
                          <option value="Гражданское дело">Гражданское дело</option>
                          <option value="Административное дело">Административное дело</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tema">Тема</Label>
                        <Input 
                          id="tema" 
                          name="tema" 
                          value={formData.tema} 
                          onChange={handleInputChange} 
                          required 
                          placeholder="Описание темы проекта"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dlitelnost">Длительность</Label>
                          <Input 
                            id="dlitelnost" 
                            name="dlitelnost" 
                            type="number" 
                            value={formData.dlitelnost} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="90"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="okruglenie">Округление</Label>
                          <select
                            id="okruglenie"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.okruglenie}
                            onChange={(e) => handleSelectChange('okruglenie', e.target.value)}
                          >
                            <option value="15">15</option>
                            <option value="30">30</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
                        <Button type="submit">Добавить</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={excelSettingsOpen} onOpenChange={setExcelSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                    >
                      Экспорт в Excel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Настройки экспорта Excel</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="headerColor" className="text-right">
                          Цвет заголовка
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                          <Input
                            id="headerColor"
                            type="color"
                            value={excelSettings.headerColor}
                            onChange={(e) => setExcelSettings(prev => ({ ...prev, headerColor: e.target.value }))}
                            className="w-12 h-8 p-1"
                          />
                          <span className="text-sm text-muted-foreground">{excelSettings.headerColor}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alternateRows" className="text-right">
                          Черезстрочный фон
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                          <Switch
                            id="alternateRows"
                            checked={excelSettings.alternateRows}
                            onCheckedChange={(checked: boolean) => setExcelSettings(prev => ({ ...prev, alternateRows: checked }))}
                          />
                          {excelSettings.alternateRows && (
                            <>
                              <Input
                                type="color"
                                value={excelSettings.alternateColor}
                                onChange={(e) => setExcelSettings(prev => ({ ...prev, alternateColor: e.target.value }))}
                                className="w-12 h-8 p-1"
                              />
                              <span className="text-sm text-muted-foreground">{excelSettings.alternateColor}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="borders" className="text-right">
                          Границы
                        </Label>
                        <div className="col-span-3">
                          <Switch
                            id="borders"
                            checked={excelSettings.borders}
                            onCheckedChange={(checked: boolean) => setExcelSettings(prev => ({ ...prev, borders: checked }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numberFormat" className="text-right">
                          Формат чисел
                        </Label>
                        <div className="col-span-3">
                          <Switch
                            id="numberFormat"
                            checked={excelSettings.numberFormat}
                            onCheckedChange={(checked: boolean) => setExcelSettings(prev => ({ ...prev, numberFormat: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setExcelSettingsOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={() => {
                        handleExportXLSX(projectData);
                        setExcelSettingsOpen(false);
                      }}>
                        Экспорт
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <DataTable 
                columns={projectColumns} 
                data={projectData}
                groupingOptions={["vidDeyatelnosti", "code"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
