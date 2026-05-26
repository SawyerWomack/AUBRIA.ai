import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString,
});

type RequestRow = {
  request_id: string;
  data: Record<string, unknown>;
  status: string;
  estimated_price: string | number | null;
  submitted_at: Date | string;
};

function rowToRequest(row: RequestRow) {
  return {
    ...row.data,
    requestId: row.request_id,
    status: row.status,
    estimatedPrice: row.estimated_price ? Number(row.estimated_price) : undefined,
    submittedAt: new Date(row.submitted_at).toISOString(),
  };
}

export async function createRequest(item: Record<string, unknown>) {
  const requestId = item.requestId as string;
  const status = (item.status as string) || 'Submitted';
  const estimatedPrice = item.estimatedPrice as number | undefined;
  const submittedAt = (item.submittedAt as string) || new Date().toISOString();

  return pool.query(
    `INSERT INTO requests (request_id, data, status, estimated_price, submitted_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      requestId,
      item,
      status,
      estimatedPrice ?? null,
      submittedAt,
    ]
  );
}

export async function getAllRequests() {
  const result = await pool.query<RequestRow>(
    `SELECT request_id, data, status, estimated_price, submitted_at
     FROM requests
     ORDER BY submitted_at DESC`
  );

  return result.rows.map(rowToRequest);
}

export async function getRequest(requestId: string) {
  const result = await pool.query<RequestRow>(
    `SELECT request_id, data, status, estimated_price, submitted_at
     FROM requests
     WHERE request_id = $1`,
    [requestId]
  );

  const row = result.rows[0];
  return row ? rowToRequest(row) : undefined;
}

export async function updateRequestStatus(requestId: string, status: string) {
  return pool.query(
    `UPDATE requests
     SET status = $2,
         data = jsonb_set(data, '{status}', to_jsonb($2::text), true)
     WHERE request_id = $1`,
    [requestId, status]
  );
}