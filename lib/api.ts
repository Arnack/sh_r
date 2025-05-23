import { CompanyBrowseRequest, CompanyBrowseResponse, CompanyFilters } from '@/types/api';

// Use local API route instead of external URL to avoid CORS issues
const API_BASE_URL = '/api';

// Custom error class for API errors
export class ApiError extends Error {
  status?: number;

  constructor({ message, status }: { message: string; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Default request configuration
const DEFAULT_REQUEST: CompanyBrowseRequest = {
  SqlUserName: "j4j8OsL+VLW4aiPI4dBruw==",
  SqlPassword: "fzpVIhRpcIGNj3ruDsiWJg==",
  Server: null,
  Database: null,
  DbUserName: null,
  StateSelector: 1,
  EmployeeID: null,
  ContractSelector: 0,
  CompanyStatusSelector: 0,
  CompanyStatusID: null,
  View: 0,
  ShowMine: true,
  ShowOnlyOpen: false,
  Page: 1,
  PageSize: 50,
};

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface FilterOptions {
  showMine?: boolean;
  showOnlyOpen?: boolean;
  stateSelector?: number;
  contractSelector?: number;
  companyStatusSelector?: number;
  employeeID?: number | null;
  companyStatusID?: number | null;
}

export interface SearchOptions {
  query?: string;
  searchFields?: string[];
}

export interface AdvancedQueryOptions {
  pagination?: PaginationOptions;
  filters?: FilterOptions;
  advancedFilters?: CompanyFilters;
  search?: SearchOptions;
}

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If we can't parse error response, use default message
        }

        throw new ApiError({
          message: errorMessage,
          status: response.status,
        });
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ApiError({
          message: error.message,
          status: (error as any).status,
        });
      }
      throw new ApiError({
        message: 'An unknown error occurred',
      });
    }
  }

  static async browseCompanies(
    customRequest?: Partial<CompanyBrowseRequest>
  ): Promise<CompanyBrowseResponse> {
    const requestBody = {
      ...DEFAULT_REQUEST,
      ...customRequest,
    };

    return this.makeRequest<CompanyBrowseResponse>('/companies', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  static async browseCompaniesWithFilters(
    filters: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<CompanyBrowseResponse> {
    const customRequest: Partial<CompanyBrowseRequest> = {
      ShowMine: filters.showMine,
      ShowOnlyOpen: filters.showOnlyOpen,
      StateSelector: filters.stateSelector,
      ContractSelector: filters.contractSelector,
      CompanyStatusSelector: filters.companyStatusSelector,
      EmployeeID: filters.employeeID,
      CompanyStatusID: filters.companyStatusID,
      Page: pagination?.page,
      PageSize: pagination?.pageSize,
      SortBy: pagination?.sortBy,
      SortDirection: pagination?.sortDirection,
    };

    return this.browseCompanies(customRequest);
  }

  // New method for paginated requests
  static async browseCompaniesPaginated(
    filters: FilterOptions = {},
    pagination: PaginationOptions = {}
  ): Promise<CompanyBrowseResponse> {
    return this.browseCompaniesWithFilters(filters, pagination);
  }

  // New comprehensive query method with all server-side capabilities
  static async queryCompanies(options: AdvancedQueryOptions = {}): Promise<CompanyBrowseResponse> {
    const { pagination, filters, advancedFilters, search } = options;
    
    const customRequest: Partial<CompanyBrowseRequest> = {
      // Basic filters
      ShowMine: filters?.showMine,
      ShowOnlyOpen: filters?.showOnlyOpen,
      StateSelector: filters?.stateSelector,
      ContractSelector: filters?.contractSelector,
      CompanyStatusSelector: filters?.companyStatusSelector,
      EmployeeID: filters?.employeeID,
      CompanyStatusID: filters?.companyStatusID,
      
      // Pagination and sorting
      Page: pagination?.page,
      PageSize: pagination?.pageSize,
      SortBy: pagination?.sortBy,
      SortDirection: pagination?.sortDirection,
      
      // Search
      Search: search?.query,
      SearchFields: search?.searchFields,
      
      // Advanced filters
      Filters: advancedFilters,
    };

    return this.browseCompanies(customRequest);
  }

  // Simplified search method
  static async searchCompanies(
    query: string,
    options: {
      searchFields?: string[];
      pagination?: PaginationOptions;
      filters?: FilterOptions;
    } = {}
  ): Promise<CompanyBrowseResponse> {
    return this.queryCompanies({
      search: {
        query,
        searchFields: options.searchFields,
      },
      pagination: options.pagination,
      filters: options.filters,
    });
  }

  // Method with advanced filtering
  static async filterCompanies(
    advancedFilters: CompanyFilters,
    options: {
      pagination?: PaginationOptions;
      filters?: FilterOptions;
      search?: SearchOptions;
    } = {}
  ): Promise<CompanyBrowseResponse> {
    return this.queryCompanies({
      advancedFilters,
      pagination: options.pagination,
      filters: options.filters,
      search: options.search,
    });
  }

  // Cache management methods
  static async clearCache(): Promise<void> {
    await this.makeRequest('/cache', {
      method: 'DELETE',
    });
  }

  static async getCacheStats(): Promise<any> {
    return this.makeRequest('/cache', {
      method: 'GET',
    });
  }
} 