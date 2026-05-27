import { NextRequest, NextResponse } from 'next/server';
import { getDownload } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const key = request.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }
  try {
    const download = await getDownload(key);

    return new NextResponse(download.body, {
      headers: {
        'Content-Type': download.contentType,
        'Content-Disposition': `attachment; filename="${download.filename.replace(/"/g, '')}"`,
      },
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
