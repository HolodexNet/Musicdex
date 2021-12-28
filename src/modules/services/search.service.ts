import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { useClient } from "../client";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export interface SearchParams<T> {
  q: string;
  query_by?: string;
  query_by_weights?: string;
  prefix?: boolean; // default: true
  filter_by?: string;
  sort_by?: string; // default: text match desc
  facet_by?: string;
  max_facet_values?: number;
  facet_query?: string;
  page?: number; // default: 1
  per_page?: number; // default: 10, max 250
  group_by?: keyof T;
  group_limit?: number; // default:
  include_fields?: string;
  exclude_fields?: string;
  highlight_fields?: string; // default: all queried fields
  highlight_full_fields?: string; // default: all fields
  highlight_affix_num_tokens?: number; // default: 4
  highlight_start_tag?: string; // default: <mark>
  highlight_end_tag?: string; // default: </mark>
  snippet_threshold?: number; // default: 30
  num_typos?: string; // default: 2
  drop_tokens_threshold?: number; // default: 10
  typo_tokens_threshold?: number; // default: 100
  pinned_hits?: string;
  hidden_hits?: string;
  limit_hits?: number; // default: no limit
  pre_segmented_query?: boolean;
  enable_overrides?: boolean;
  prioritize_exact_match?: boolean; // default: true
}

export interface SearchResponse<T> {
  facet_counts?: SearchResponseFacetCountSchema<T>[];
  found: number;
  out_of: number;
  page: number;
  request_params: SearchParams<T>;
  search_time_ms: number;
  hits?: { document: T; text_match: number }[];
  // grouped_hits?: {
  //   group_key: string[]
  //   hits: SearchResponseHit<T>[]
  // }[]
}

export interface SearchResponseFacetCountSchema<T> {
  counts: [
    {
      count: number;
      highlighted: string;
      value: string;
    }
  ];
  field_name: keyof T;
  stats: {
    avg?: number;
    max?: number;
    min?: number;
    sum?: number;
  };
}

export const useSongSearch = <T>(q: SearchParams<T>, callbacks = {}) => {
  const { AxiosInstance } = useClient();

  return useQuery(
    ["search", q.page, q],
    async () => {
      return (
        await AxiosInstance<SearchResponse<T>>("/musicdex/search", {
          method: "POST",
          data: q,
        })
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      ...callbacks,
    }
  );
};
