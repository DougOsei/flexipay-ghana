// Transparently rewrite `/api/...` calls to VITE_API_URL when frontend is hosted separately (e.g. GitHub Pages + Render).
export function initApiRewrite() {
  const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  if (API_URL && !window.__flexipayFetchPatched) {
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      if (typeof input === 'string' && input.startsWith('/api')) {
        input = API_URL + input;
      }
      return nativeFetch(input, init);
    };
    window.__flexipayFetchPatched = true;
  }
}

export function getAppUrl(subpath = '') {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const cleanSub = subpath.replace(/^\/+/, '');
  return cleanSub ? `${base}/${cleanSub}` : `${base}/`;
}
