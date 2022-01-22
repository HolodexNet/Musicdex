export const DEFAULT_FETCH_CONFIG /*: Omit<UseQueryOptions, 'queryKey'>*/ = {
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  retry: 1,
  retryDelay: 200,
  cacheTime: 1000 * 60 * 60, //60 min cache.
  keepPreviousData: true,
  staleTime: 1000 * 60 * 10, // 10 minute staleness.
};
