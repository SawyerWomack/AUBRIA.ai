import { randomUUID } from 'crypto';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';

const DEFAULT_UPLOAD_DIR = path.join(process.cwd(), 'uploads-local');

const CONTENT_TYPES: Record<string, string> = {
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
};

function uploadRoot() {
  return process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
}

function safeFileName(name: string) {
  const base = path.basename(name);
  return base.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

function safeUploadPath(key: string) {
  const root = uploadRoot();
  const resolved = path.resolve(root, key);
  const rootResolved = path.resolve(root);

  if (!resolved.startsWith(`${rootResolved}${path.sep}`)) {
    throw new Error('Invalid file key');
  }

  return resolved;
}

export async function uploadToLocalFiles(originalName: string, body: Buffer) {
  const now = new Date();
  const datePath = now.toISOString().slice(0, 10);
  const fileName = `${randomUUID()}-${safeFileName(originalName)}`;
  const key = path.posix.join('uploads', datePath, fileName);
  const fullPath = safeUploadPath(key);

  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, body);

  return key;
}

export async function getLocalFile(key: string) {
  const fullPath = safeUploadPath(key);
  const info = await stat(fullPath);

  if (!info.isFile()) {
    throw new Error('File not found');
  }

  const body = await readFile(fullPath);
  const ext = path.extname(fullPath).slice(1).toLowerCase();

  return {
    body,
    contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
    filename: path.basename(fullPath),
  };
}
