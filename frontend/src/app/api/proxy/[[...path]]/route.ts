import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function handler(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const pathString = path ? path.join('/') : '';
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: headers,
      body:
        request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
      cache: 'no-store',
    });

    const body = response.status === 204 ? null : await response.blob();
    return new NextResponse(body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
