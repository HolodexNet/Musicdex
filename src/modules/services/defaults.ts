export const DEFAULT_FETCH_CONFIG /*: Omit<UseQueryOptions, 'queryKey'>*/ = {
  refetchOnWindowFocus: false,
  retry: 1,
  retryDelay: 200,
  cacheTime: 1000 * 60 * 30, //30 minute cache.
  keepPreviousData: true,
  staleTime: 1000 * 60 * 5, // 5 minute staleness.
};
