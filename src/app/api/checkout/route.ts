import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: true, sessionId: 'cs_mock_' + Date.now(), url: 'http://localhost:3000/checkout?success=true' });
}
