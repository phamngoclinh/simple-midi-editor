const isServer = typeof window === 'undefined';
const BACKEND_URL =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const BASE_API_URL = isServer ? BACKEND_URL : '/api/proxy';
