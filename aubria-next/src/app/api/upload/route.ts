import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/aws';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const ext = file.name.split('.').pop();
    const key = `uploads/${uuidv4()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadToS3(key, buffer, file.type);
    return NextResponse.json({ key });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
