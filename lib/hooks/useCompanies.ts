import { useState, useEffect, useCallback } from 'react';
import { ApiService, ApiError } from '@/lib/api';
import { Company, CompanyBrowseResponse } from '@/types/api';

interface UseCompaniesOptions {
  autoFetch?: boolean;
  showMine?: boolean;
  showOnlyOpen?: boolean;
  stateSelector?: number;
  contractSelector?: number;
  companyStatusSelector?: number;
  employeeID?: number | null;
  companyStatusID?: number | null;
}

interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchWithFilters: (filters: Omit<UseCompaniesOptions, 'autoFetch'>) => Promise<void>;
  totalCount: number;
  properties: any[];
  propertyValues: any[];
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
  } = options;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertyValues, setPropertyValues] = useState<any[]>([]);

  const fetchCompanies = useCallback(async (filters?: Omit<UseCompaniesOptions, 'autoFetch'>) => {
    setLoading(true);
    setError(null);

    try {
      const filterParams = filters || {
        showMine,
        showOnlyOpen,
        stateSelector,
        contractSelector,
        companyStatusSelector,
        employeeID,
        companyStatusID,
      };

      const response: CompanyBrowseResponse = await ApiService.browseCompaniesWithFilters(filterParams);
      
      setCompanies(response.Companies || []);
      setProperties(response.Properties || []);
      setPropertyValues(response.PropertyValues || []);
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
    } finally {
      setLoading(false);
    }
  }, [showMine, showOnlyOpen, stateSelector, contractSelector, companyStatusSelector, employeeID, companyStatusID]);

  const refetch = useCallback(() => fetchCompanies(), [fetchCompanies]);

  const fetchWithFilters = useCallback(
    (filters: Omit<UseCompaniesOptions, 'autoFetch'>) => fetchCompanies(filters),
    [fetchCompanies]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchCompanies();
    }
  }, [autoFetch, fetchCompanies]);

  return {
    companies,
    loading,
    error,
    refetch,
    fetchWithFilters,
    totalCount: companies.length,
    properties,
    propertyValues,
  };
} 