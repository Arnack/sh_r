import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { CompanyFilters } from '@/types/api';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

interface AdvancedSearchProps {
  onSearch: (query: string, searchFields: string[]) => void;
  onFilter: (filters: CompanyFilters) => void;
  onClear: () => void;
  loading?: boolean;
  searchInfo?: {
    query: string;
    fieldsSearched: string[];
    totalMatches: number;
    searchTime: number;
  };
}

const SEARCH_FIELDS = [
  { key: 'FileAs', label: 'Название' },
  { key: 'LegalName', label: 'Юридическое название' },
  { key: 'LegalCode', label: 'Код' },
  { key: 'KPP', label: 'КПП' },
  { key: 'Phone1', label: 'Телефон' },
  { key: 'Email', label: 'Email' },
  { key: 'City', label: 'Город' },
  { key: 'Industries', label: 'Отрасли' },
];

export function AdvancedSearch({ 
  onSearch, 
  onFilter, 
  onClear, 
  loading = false,
  searchInfo 
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchFields, setSelectedSearchFields] = useState<string[]>(['FileAs', 'LegalName', 'LegalCode']);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState<CompanyFilters>({});

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery, selectedSearchFields);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: keyof CompanyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowAdvancedFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    onClear();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск компаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
            disabled={loading}
          />
        </div>
        
        {/* Search Fields Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={loading}>
              Поля ({selectedSearchFields.length}) <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {SEARCH_FIELDS.map((field) => (
              <DropdownMenuCheckboxItem
                key={field.key}
                checked={selectedSearchFields.includes(field.key)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSearchFields([...selectedSearchFields, field.key]);
                  } else {
                    setSelectedSearchFields(selectedSearchFields.filter(f => f !== field.key));
                  }
                }}
              >
                {field.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
          Поиск
        </Button>

        {/* Advanced Filters Button */}
        <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Фильтры {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Расширенные фильтры</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6">
              {/* Text Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Текстовые фильтры</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fileAs">Название</Label>
                    <Input
                      id="fileAs"
                      value={filters.fileAs || ''}
                      onChange={(e) => handleFilterChange('fileAs', e.target.value)}
                      placeholder="Поиск по названию"
                    />
                  </div>
                  <div>
                    <Label htmlFor="legalName">Юридическое название</Label>
                    <Input
                      id="legalName"
                      value={filters.legalName || ''}
                      onChange={(e) => handleFilterChange('legalName', e.target.value)}
                      placeholder="Поиск по юр. названию"
                    />
                  </div>
                  <div>
                    <Label htmlFor="legalCode">Код</Label>
                    <Input
                      id="legalCode"
                      value={filters.legalCode || ''}
                      onChange={(e) => handleFilterChange('legalCode', e.target.value)}
                      placeholder="Поиск по коду"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kpp">КПП</Label>
                    <Input
                      id="kpp"
                      value={filters.kpp || ''}
                      onChange={(e) => handleFilterChange('kpp', e.target.value)}
                      placeholder="Поиск по КПП"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      value={filters.city || ''}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      placeholder="Поиск по городу"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industries">Отрасли</Label>
                    <Input
                      id="industries"
                      value={filters.industries || ''}
                      onChange={(e) => handleFilterChange('industries', e.target.value)}
                      placeholder="Поиск по отраслям"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Boolean Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Параметры</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.applyVAT === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange('applyVAT', checked ? true : undefined)
                      }
                    />
                    <Label>Применяет НДС</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.isPrivate === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange('isPrivate', checked ? true : undefined)
                      }
                    />
                    <Label>Частная компания</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.hasEmail === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange('hasEmail', checked ? true : undefined)
                      }
                    />
                    <Label>Есть Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.hasPhone === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange('hasPhone', checked ? true : undefined)
                      }
                    />
                    <Label>Есть телефон</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={filters.hasWebPage === true}
                      onCheckedChange={(checked) => 
                        handleFilterChange('hasWebPage', checked ? true : undefined)
                      }
                    />
                    <Label>Есть веб-сайт</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Date Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Фильтры по датам</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="createdFrom">Создано с</Label>
                    <Input
                      id="createdFrom"
                      type="date"
                      value={filters.createdFrom || ''}
                      onChange={(e) => handleFilterChange('createdFrom', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="createdTo">Создано до</Label>
                    <Input
                      id="createdTo"
                      type="date"
                      value={filters.createdTo || ''}
                      onChange={(e) => handleFilterChange('createdTo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="modifiedFrom">Изменено с</Label>
                    <Input
                      id="modifiedFrom"
                      type="date"
                      value={filters.modifiedFrom || ''}
                      onChange={(e) => handleFilterChange('modifiedFrom', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="modifiedTo">Изменено до</Label>
                    <Input
                      id="modifiedTo"
                      type="date"
                      value={filters.modifiedTo || ''}
                      onChange={(e) => handleFilterChange('modifiedTo', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAdvancedFilters(false)}>
                Отмена
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Очистить
              </Button>
              <Button onClick={applyFilters}>
                Применить фильтры
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {(searchQuery || getActiveFiltersCount() > 0) && (
          <Button variant="outline" onClick={clearFilters} disabled={loading}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Info */}
      {searchInfo && (
        <div className="text-sm text-muted-foreground">
          Найдено <strong>{searchInfo.totalMatches}</strong> результатов по запросу "{searchInfo.query}" 
          в полях: {searchInfo.fieldsSearched.join(', ')} 
          (за {searchInfo.searchTime}мс)
        </div>
      )}
    </div>
  );
} 