import https from 'https';
import { NextRequest, NextResponse } from 'next/server';

// Target API for proxying; keep separate from the public base URL to avoid loops
const TARGET_API_URL =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://eventconnect-api-8oih6.ondigitalocean.app/api';

// Allow self-signed certs when proxying to local HTTPS
const httpsAgent = TARGET_API_URL.includes('localhost')
  ? new https.Agent({ rejectUnauthorized: false })
  : undefined;

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `${TARGET_API_URL}/${path}${request.nextUrl.search}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: request.headers,
    agent: httpsAgent,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `${TARGET_API_URL}/${path}`;
  const body = await request.json();

  const response = await fetch(url, {
    method: 'POST',
    headers: request.headers,
    agent: httpsAgent,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `${TARGET_API_URL}/${path}`;
  const body = await request.json();

  const response = await fetch(url, {
    method: 'PUT',
    headers: request.headers,
    agent: httpsAgent,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `${TARGET_API_URL}/${path}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: request.headers,
    agent: httpsAgent,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
