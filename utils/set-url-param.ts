export function setUrlParam(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined
): void {
  if (value === null || value === undefined) {
    params.delete(key);
  } else {
    params.set(key, String(value));
  }
}
