import * as localFiles from './local-files';
import * as postgres from './postgres';

export const createRequest = postgres.createRequest;
export const getAllRequests = postgres.getAllRequests;
export const getRequest = postgres.getRequest;
export const updateRequestStatus = postgres.updateRequestStatus;

export async function uploadFile(originalName: string, body: Buffer) {
  return localFiles.uploadToLocalFiles(originalName, body);
}

export async function getDownload(key: string) {
  return {
    kind: 'file' as const,
    ...(await localFiles.getLocalFile(key)),
  };
}
