import { randomUUID } from 'crypto';
import * as aws from './aws';
import * as localFiles from './local-files';
import * as postgres from './postgres';

const provider = process.env.STORAGE_PROVIDER || 'aws';

const usePostgres = provider.toLowerCase() === 'postgres';

export const createRequest = usePostgres
  ? postgres.createRequest
  : aws.createRequest;

export const getAllRequests = usePostgres
  ? postgres.getAllRequests
  : aws.getAllRequests;

export const getRequest = usePostgres
  ? postgres.getRequest
  : aws.getRequest;

export const updateRequestStatus = usePostgres
  ? postgres.updateRequestStatus
  : aws.updateRequestStatus;

export async function uploadFile(originalName: string, body: Buffer, contentType: string) {
  if (usePostgres) {
    return localFiles.uploadToLocalFiles(originalName, body);
  }

  const ext = originalName.split('.').pop() || 'file';
  const key = `uploads/${randomUUID()}.${ext}`;
  await aws.uploadToS3(key, body, contentType);
  return key;
}

export async function getDownload(key: string) {
  if (usePostgres) {
    return {
      kind: 'file' as const,
      ...(await localFiles.getLocalFile(key)),
    };
  }

  return {
    kind: 'url' as const,
    url: await aws.getDownloadUrl(key),
  };
}
