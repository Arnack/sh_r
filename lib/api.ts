import { CompanyBrowseRequest, CompanyBrowseResponse } from '@/types/api';

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
  ShowOnlyOpen: false
};

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

  static async browseCompaniesWithFilters(filters: {
    showMine?: boolean;
    showOnlyOpen?: boolean;
    stateSelector?: number;
    contractSelector?: number;
    companyStatusSelector?: number;
    employeeID?: number | null;
    companyStatusID?: number | null;
  }): Promise<CompanyBrowseResponse> {
    const customRequest: Partial<CompanyBrowseRequest> = {
      ShowMine: filters.showMine,
      ShowOnlyOpen: filters.showOnlyOpen,
      StateSelector: filters.stateSelector,
      ContractSelector: filters.contractSelector,
      CompanyStatusSelector: filters.companyStatusSelector,
      EmployeeID: filters.employeeID,
      CompanyStatusID: filters.companyStatusID,
    };

    return this.browseCompanies(customRequest);
  }
} 