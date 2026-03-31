import { NextRequest, NextResponse } from 'next/server';
import { createRequest, getAllRequests } from '@/lib/aws';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestId = uuidv4();

    // DynamoDB doesn't allow empty strings — convert them to null-safe values
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (value === '') {
        cleaned[key] = '-';
      } else if (Array.isArray(value) && value.length === 0) {
        cleaned[key] = ['-'];
      } else {
        cleaned[key] = value;
      }
    }

    const item = {
      requestId,
      ...cleaned,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    await createRequest(item);
    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    console.error('Error creating request:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create request', details: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const items = await getAllRequests();
    return NextResponse.json({ requests: items });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
