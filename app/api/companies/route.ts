import { NextRequest, NextResponse } from 'next/server';
import { CompanyBrowseRequest } from '@/types/api';

const EXTERNAL_API_URL = 'https://dev01.projectmate.ru/pwa6/api/company/ef/linq/browse/all';

export async function POST(request: NextRequest) {
  try {
    const body: CompanyBrowseRequest = await request.json();

    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
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