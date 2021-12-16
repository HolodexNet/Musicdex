export function encodeUrl(url: string, params: any) {
  const query = new URLSearchParams(params);
  return `${url}?${query}`;
}
