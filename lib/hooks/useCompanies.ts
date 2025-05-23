import { useState, useEffect, useCallback } from 'react';
import { ApiService, ApiError, FilterOptions, PaginationOptions, SearchOptions, AdvancedQueryOptions } from '@/lib/api';
import { Company, CompanyBrowseResponse, PaginationMeta, CompanyFilters } from '@/types/api';

interface UseCompaniesOptions extends FilterOptions {
  autoFetch?: boolean;
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortDirection?: 'asc' | 'desc';
}

interface UseCompaniesReturn {
  // Data
  companies: Company[];
  loading: boolean;
  error: string | null;
  properties: any[];
  propertyValues: any[];
  
  // Pagination
  pagination: PaginationMeta | null;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  
  // Sorting
  sortBy: string | undefined;
  sortDirection: 'asc' | 'desc';
  
  // Search and Filter Info
  searchInfo: any;
  cacheInfo: any;
  
  // Actions
  refetch: () => Promise<void>;
  fetchWithFilters: (filters: FilterOptions, paginationOpts?: PaginationOptions) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  changePageSize: (size: number) => Promise<void>;
  sortData: (field: string, direction?: 'asc' | 'desc') => Promise<void>;
  clearCache: () => Promise<void>;
  
  // New search and filter methods
  search: (query: string, searchFields?: string[]) => Promise<void>;
  filterAdvanced: (filters: CompanyFilters) => Promise<void>;
  queryAdvanced: (options: AdvancedQueryOptions) => Promise<void>;
  clearFilters: () => Promise<void>;
}

export function useCompanies(options: UseCompaniesOptions = {}): UseCompaniesReturn {
  const {
    autoFetch = true,
    showMine = true,
    showOnlyOpen = false,
    stateSelector = 1,
    contractSelector = 0,
    companyStatusSelector = 0,
    employeeID = null,
    companyStatusID = null,
    initialPage = 1,
    initialPageSize = 50,
    initialSortBy,
    initialSortDirection = 'asc',
  } = options;

  // Data state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertyValues, setPropertyValues] = useState<any[]>([]);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  // Current filters and search state
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    showMine,
    showOnlyOpen,
    stateSelector,
    contractSelector,
    companyStatusSelector,
    employeeID,
    companyStatusID,
  });
  
  const [currentAdvancedFilters, setCurrentAdvancedFilters] = useState<CompanyFilters>({});
  const [currentSearch, setCurrentSearch] = useState<SearchOptions>({});
  
  // Response metadata
  const [searchInfo, setSearchInfo] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<any>(null);

  const executeQuery = useCallback(async (queryOptions?: AdvancedQueryOptions) => {
    setLoading(true);
    setError(null);

    try {
      const options: AdvancedQueryOptions = queryOptions || {
        filters: currentFilters,
        advancedFilters: currentAdvancedFilters,
        search: currentSearch,
        pagination: {
          page: currentPage,
          pageSize: pageSize,
          sortBy: sortBy,
          sortDirection: sortDirection,
        },
      };

      const response: CompanyBrowseResponse = await ApiService.queryCompanies(options);
      
      setCompanies(response.Companies || []);
      setProperties(response.Properties || []);
      setPropertyValues(response.PropertyValues || []);
      setPagination(response.Pagination || null);
      setSearchInfo(response.SearchInfo || null);
      setCacheInfo(response.CacheInfo || null);
      
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle specific API errors
        if (err.status === 404) {
          setError('API endpoint not found. Please check the server configuration.');
        } else if (err.status === 500) {
          setError('Server error. Please try again later.');
        } else if (err.status === 0 || !err.status) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(`API Error (${err.status}): ${err.message}`);
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred');
      }
      setCompanies([]);
      setProperties([]);
      setPropertyValues([]);
      setPagination(null);
      setSearchInfo(null);
      setCacheInfo(null);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, currentAdvancedFilters, currentSearch, currentPage, pageSize, sortBy, sortDirection]);

  // Pagination actions
  const goToPage = useCallback(async (page: number) => {
    setCurrentPage(page);
    await executeQuery({
      filters: currentFilters,
      advancedFilters: currentAdvancedFilters,
      search: currentSearch,
      pagination: { page, pageSize, sortBy, sortDirection },
    });
  }, [executeQuery, currentFilters, currentAdvancedFilters, currentSearch, pageSize, sortBy, sortDirection]);

  const changePageSize = useCallback(async (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    await executeQuery({
      filters: currentFilters,
      advancedFilters: currentAdvancedFilters,
      search: currentSearch,
      pagination: { page: 1, pageSize: size, sortBy, sortDirection },
    });
  }, [executeQuery, currentFilters, currentAdvancedFilters, currentSearch, sortBy, sortDirection]);

  // Sorting actions
  const sortData = useCallback(async (field: string, direction?: 'asc' | 'desc') => {
    const newDirection = direction || (sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortBy(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
    
    await executeQuery({
      filters: currentFilters,
      advancedFilters: currentAdvancedFilters,
      search: currentSearch,
      pagination: { page: 1, pageSize, sortBy: field, sortDirection: newDirection },
    });
  }, [executeQuery, currentFilters, currentAdvancedFilters, currentSearch, pageSize, sortBy, sortDirection]);

  // Search actions
  const search = useCallback(async (query: string, searchFields?: string[]) => {
    const searchOptions = { query, searchFields };
    setCurrentSearch(searchOptions);
    setCurrentPage(1);
    
    await executeQuery({
      filters: currentFilters,
      advancedFilters: currentAdvancedFilters,
      search: searchOptions,
      pagination: { page: 1, pageSize, sortBy, sortDirection },
    });
  }, [executeQuery, currentFilters, currentAdvancedFilters, pageSize, sortBy, sortDirection]);

  // Advanced filter actions
  const filterAdvanced = useCallback(async (filters: CompanyFilters) => {
    setCurrentAdvancedFilters(filters);
    setCurrentPage(1);
    
    await executeQuery({
      filters: currentFilters,
      advancedFilters: filters,
      search: currentSearch,
      pagination: { page: 1, pageSize, sortBy, sortDirection },
    });
  }, [executeQuery, currentFilters, currentSearch, pageSize, sortBy, sortDirection]);

  // Combined query method
  const queryAdvanced = useCallback(async (options: AdvancedQueryOptions) => {
    if (options.filters) setCurrentFilters(options.filters);
    if (options.advancedFilters) setCurrentAdvancedFilters(options.advancedFilters);
    if (options.search) setCurrentSearch(options.search);
    if (options.pagination?.page) setCurrentPage(options.pagination.page);
    if (options.pagination?.pageSize) setPageSize(options.pagination.pageSize);
    if (options.pagination?.sortBy) setSortBy(options.pagination.sortBy);
    if (options.pagination?.sortDirection) setSortDirection(options.pagination.sortDirection);
    
    await executeQuery(options);
  }, [executeQuery]);

  // Clear filters action
  const clearFilters = useCallback(async () => {
    setCurrentAdvancedFilters({});
    setCurrentSearch({});
    setCurrentPage(1);
    
    await executeQuery({
      filters: currentFilters,
      advancedFilters: {},
      search: {},
      pagination: { page: 1, pageSize, sortBy, sortDirection },
    });
  }, [executeQuery, currentFilters, pageSize, sortBy, sortDirection]);

  // Legacy methods
  const refetch = useCallback(() => executeQuery(), [executeQuery]);

  const fetchWithFilters = useCallback(
    (filters: FilterOptions, paginationOpts?: PaginationOptions) => {
      setCurrentFilters(filters);
      if (paginationOpts?.page) setCurrentPage(paginationOpts.page);
      return executeQuery({
        filters,
        advancedFilters: currentAdvancedFilters,
        search: currentSearch,
        pagination: paginationOpts,
      });
    },
    [executeQuery, currentAdvancedFilters, currentSearch]
  );

  const clearCache = useCallback(async () => {
    try {
      await ApiService.clearCache();
      await refetch();
    } catch (err) {
      console.error('Failed to clear cache:', err);
    }
  }, [refetch]);

  useEffect(() => {
    if (autoFetch) {
      executeQuery();
    }
  }, [autoFetch, executeQuery]);

  return {
    // Data
    companies,
    loading,
    error,
    properties,
    propertyValues,
    
    // Pagination
    pagination,
    currentPage,
    pageSize,
    totalItems: pagination?.totalItems || companies.length,
    totalPages: pagination?.totalPages || 1,
    
    // Sorting
    sortBy,
    sortDirection,
    
    // Search and Filter Info
    searchInfo,
    cacheInfo,
    
    // Actions
    refetch,
    fetchWithFilters,
    goToPage,
    changePageSize,
    sortData,
    clearCache,
    
    // New search and filter methods
    search,
    filterAdvanced,
    queryAdvanced,
    clearFilters,
  };
} 