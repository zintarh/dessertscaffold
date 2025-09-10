import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test 1: Basic database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test 2: Count users
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Test 3: Get first user (if any)
    const firstUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        createdAt: true
      }
    });
    
    // Test 4: Get database info
    const dbInfo = await prisma.$queryRaw`SELECT version() as version`;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        userCount,
        firstUser,
        dbInfo,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    });
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorName = error instanceof Error ? error.name : 'Unknown';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: {
        message: errorMessage,
        name: errorName,
        stack: errorStack,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}
