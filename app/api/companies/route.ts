import { NextRequest, NextResponse } from 'next/server';
import { CompanyBrowseRequest, CompanyBrowseResponse, Company, PaginationMeta, CompanyFilters } from '@/types/api';
import { apiCache, createCompanyCacheKey } from '@/lib/cache';

const EXTERNAL_API_URL = 'https://dev01.projectmate.ru/pwa6/api/company/ef/linq/browse/all';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Server-side filtering function
function filterCompanies(companies: Company[], filters: CompanyFilters): Company[] {
  return companies.filter(company => {
    // Text filters (case-insensitive partial matches)
    if (filters.fileAs && !company.FileAs?.toLowerCase().includes(filters.fileAs.toLowerCase())) {
      return false;
    }
    if (filters.legalName && !company.LegalName?.toLowerCase().includes(filters.legalName.toLowerCase())) {
      return false;
    }
    if (filters.legalCode && !company.LegalCode?.toLowerCase().includes(filters.legalCode.toLowerCase())) {
      return false;
    }
    if (filters.kpp && !company.KPP?.toLowerCase().includes(filters.kpp.toLowerCase())) {
      return false;
    }
    if (filters.phone && !company.Phone1?.toLowerCase().includes(filters.phone.toLowerCase())) {
      return false;
    }
    if (filters.email && !company.Email?.toLowerCase().includes(filters.email.toLowerCase())) {
      return false;
    }
    if (filters.city && !company.City?.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.country && !company.Country?.toLowerCase().includes(filters.country.toLowerCase())) {
      return false;
    }
    if (filters.industries && !company.Industries?.toLowerCase().includes(filters.industries.toLowerCase())) {
      return false;
    }

    // Boolean filters
    if (filters.applyVAT !== undefined && company.ApplyVAT !== filters.applyVAT) {
      return false;
    }
    if (filters.isPrivate !== undefined && company.Private !== filters.isPrivate) {
      return false;
    }
    if (filters.hasEmail !== undefined) {
      const hasEmail = !!(company.Email && company.Email.trim());
      if (hasEmail !== filters.hasEmail) return false;
    }
    if (filters.hasPhone !== undefined) {
      const hasPhone = !!(company.Phone1 && company.Phone1.trim());
      if (hasPhone !== filters.hasPhone) return false;
    }
    if (filters.hasWebPage !== undefined) {
      const hasWebPage = !!(company.WebPage && company.WebPage.trim());
      if (hasWebPage !== filters.hasWebPage) return false;
    }

    // Date filters
    if (filters.createdFrom || filters.createdTo) {
      const createdDate = new Date(company.Created);
      if (filters.createdFrom && createdDate < new Date(filters.createdFrom)) {
        return false;
      }
      if (filters.createdTo && createdDate > new Date(filters.createdTo)) {
        return false;
      }
    }

    if (filters.modifiedFrom || filters.modifiedTo) {
      const modifiedDate = new Date(company.Modified);
      if (filters.modifiedFrom && modifiedDate < new Date(filters.modifiedFrom)) {
        return false;
      }
      if (filters.modifiedTo && modifiedDate > new Date(filters.modifiedTo)) {
        return false;
      }
    }

    return true;
  });
}

// Server-side search function
function searchCompanies(companies: Company[], query: string, searchFields?: string[]): Company[] {
  if (!query.trim()) return companies;

  const searchTerm = query.toLowerCase();
  const defaultSearchFields = ['FileAs', 'LegalName', 'LegalCode', 'KPP', 'Phone1', 'Email', 'City', 'Industries'];
  const fieldsToSearch = searchFields || defaultSearchFields;

  return companies.filter(company => {
    return fieldsToSearch.some(field => {
      const value = (company as any)[field];
      return value && String(value).toLowerCase().includes(searchTerm);
    });
  });
}

// Server-side sorting function
function sortCompanies(companies: Company[], sortBy: string, sortDirection: 'asc' | 'desc'): Company[] {
  if (!sortBy) return companies;

  return [...companies].sort((a, b) => {
    let aValue = (a as any)[sortBy];
    let bValue = (b as any)[sortBy];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

    // Handle dates
    if (sortBy === 'Created' || sortBy === 'Modified' || sortBy === 'FoundationDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } 
    // Handle numbers
    else if (typeof aValue === 'number' && typeof bValue === 'number') {
      // Keep as numbers
    }
    // Handle strings
    else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    let comparison: number;
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: CompanyBrowseRequest = await request.json();
    
    // Extract parameters
    const page = body.Page || 1;
    const pageSize = body.PageSize || 50;
    const sortBy = body.SortBy;
    const sortDirection = body.SortDirection || 'asc';
    const searchQuery = body.Search || '';
    const searchFields = body.SearchFields;
    const filters = body.Filters || {};

    // Create cache key (exclude dynamic params)
    const baseRequest = { ...body };
    delete baseRequest.Page;
    delete baseRequest.PageSize;
    delete baseRequest.SortBy;
    delete baseRequest.SortDirection;
    delete baseRequest.Search;
    delete baseRequest.SearchFields;
    delete baseRequest.Filters;
    
    const cacheKey = createCompanyCacheKey(baseRequest);
    
    // Check cache for base data
    let fullResponse: CompanyBrowseResponse | null = apiCache.get(cacheKey);
    const cacheHit = !!fullResponse;
    
    if (!fullResponse) {
      console.log('Cache miss - fetching from external API');
      
      const response = await fetch(EXTERNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(baseRequest),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `External API error: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      fullResponse = await response.json();
      
      if (fullResponse) {
        apiCache.set(cacheKey, fullResponse, CACHE_TTL);
      }
    } else {
      console.log('Cache hit - applying server-side operations');
    }

    if (!fullResponse) {
      return NextResponse.json(
        { error: 'No data received from API' },
        { status: 500 }
      );
    }

    let companies = [...(fullResponse.Companies || [])];
    let totalBeforeFiltering = companies.length;

    // Apply server-side search
    let searchInfo = undefined;
    if (searchQuery) {
      const searchStart = Date.now();
      companies = searchCompanies(companies, searchQuery, searchFields);
      const searchTime = Date.now() - searchStart;
      
      searchInfo = {
        query: searchQuery,
        fieldsSearched: searchFields || ['FileAs', 'LegalName', 'LegalCode', 'KPP', 'Phone1', 'Email', 'City', 'Industries'],
        totalMatches: companies.length,
        searchTime: searchTime
      };
    }

    // Apply server-side filtering
    if (Object.keys(filters).length > 0) {
      companies = filterCompanies(companies, filters);
    }

    // Apply server-side sorting
    if (sortBy) {
      companies = sortCompanies(companies, sortBy, sortDirection);
    }

    // Apply server-side pagination
    const totalItems = companies.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCompanies = companies.slice(startIndex, endIndex);

    // Create pagination metadata
    const pagination: PaginationMeta = {
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      startItem: totalItems > 0 ? startIndex + 1 : 0,
      endItem: Math.min(endIndex, totalItems),
    };

    // Performance timing
    const processingTime = Date.now() - startTime;

    // Return response with metadata
    const paginatedResponse: CompanyBrowseResponse = {
      Companies: paginatedCompanies,
      Properties: fullResponse.Properties || [],
      PropertyValues: fullResponse.PropertyValues || [],
      Pagination: pagination,
      SearchInfo: searchInfo,
      CacheInfo: {
        hit: cacheHit,
        key: cacheKey,
        expiresAt: new Date(Date.now() + CACHE_TTL).toISOString(),
      }
    };

    // Add response headers
    const response = NextResponse.json(paginatedResponse);
    response.headers.set('Cache-Control', 'public, max-age=300');
    response.headers.set('X-Cache-Status', cacheHit ? 'HIT' : 'MISS');
    response.headers.set('X-Processing-Time', `${processingTime}ms`);
    response.headers.set('X-Total-Before-Filtering', totalBeforeFiltering.toString());
    response.headers.set('X-Total-After-Filtering', totalItems.toString());
    
    return response;
    
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

// Cache management endpoints
export async function DELETE() {
  try {
    apiCache.clear();
    return NextResponse.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
} 