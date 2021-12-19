export function encodeUrl(
  url: string,
  params:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
) {
  const query = new URLSearchParams(params);
  return `${url}?${query}`;
}
