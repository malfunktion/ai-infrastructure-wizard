import { createDirectory, writeToFile, dockerComposeUp } from './handlers';

export function setupAPI() {
  // Create routes for our API endpoints
  const routes = new Map<string, (req: Request) => Promise<Response>>();
  routes.set('/api/create-dir', createDirectory);
  routes.set('/api/write-file', writeToFile);
  routes.set('/api/docker-compose-up', dockerComposeUp);

  // Set up the fetch interceptor
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
    const handler = routes.get(url);

    if (handler) {
      return handler(new Request(url, init));
    }

    return originalFetch(input, init);
  };
}
