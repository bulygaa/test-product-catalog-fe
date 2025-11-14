/**
 * Returns the appropriate base URL for API calls based on the environment
 * Server-side: Returns absolute URL
 * Client-side: Returns relative path
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT || 3000}`;
}
