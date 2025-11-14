export function setUrlArrayParam(
  params: URLSearchParams,
  key: string,
  values: string[] | undefined
): void {
  params.delete(key);

  if (values && values.length > 0) {
    values.forEach((value) => params.append(key, value));
  }
}
