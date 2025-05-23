import { NextResponse } from 'next/server';
import { apiCache } from '@/lib/cache';

export async function GET() {
  try {
    const stats = apiCache.getStats();
    const cleanedUp = apiCache.cleanup();
    
    return NextResponse.json({
      stats: {
        ...stats,
        cleanedUpExpired: cleanedUp
      },
      actions: {
        clear: '/api/cache (DELETE)',
        cleanup: 'Automatic on GET'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    apiCache.clear();
    return NextResponse.json({ 
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
} 