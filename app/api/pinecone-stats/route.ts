import { NextResponse } from 'next/server';
import { getIndexStats } from '@/src/lib/pinecone-utils';

export async function GET() {
  try {
    // Get Pinecone index statistics
    const stats = await getIndexStats();
    
    return NextResponse.json({
      success: true,
      stats,
      vectorCount: stats.totalRecordCount || 0,
      indexName: process.env.PINECONE_INDEX_NAME
    });
  } catch (error) {
    console.error('Pinecone stats error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve Pinecone statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}