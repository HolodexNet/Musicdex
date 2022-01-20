export const DEFAULT_FETCH_CONFIG /*: Omit<UseQueryOptions, 'queryKey'>*/ = {
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 1,
  retryDelay: 200,
  cacheTime: 1000 * 60 * 60, //60 min cache.
  keepPreviousData: true,
  staleTime: 1000 * 60 * 5, // 5 minute staleness.
};
