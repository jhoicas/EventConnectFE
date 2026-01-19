const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eventconnect-api-8oih6.ondigitalocean.app/api/';
export const API_BASE_URL = RAW_API_BASE_URL.endsWith('/') ? RAW_API_BASE_URL.slice(0, -1) : RAW_API_BASE_URL;
