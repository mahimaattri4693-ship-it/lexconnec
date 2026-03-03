/**
 * Custom fetch wrapper to handle JWT authentication automatically.
 * Injects Authorization header and handles 401 redirects.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('lexconnect_token');
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(path, { ...options, headers });
  
  if (res.status === 401) {
    localStorage.removeItem('lexconnect_token');
    // Only redirect if we're not already on public pages
    const publicPaths = ['/', '/login', '/register', '/know-your-rights'];
    if (!publicPaths.includes(window.location.pathname)) {
      window.location.href = '/login';
    }
  }
  
  return res;
}
