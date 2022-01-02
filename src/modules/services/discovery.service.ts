import axios from "axios";
import { useQuery } from "react-query";
import { DEFAULT_FETCH_CONFIG } from "./defaults";

export function useDiscoveryOrg(org: string) {
  return useQuery(
    ["discovery", org],
    async (qk) => {
      return (
        await axios.get(
          "/api/v2/musicdex/discovery/org/" + qk.queryKey[1] + "/"
        )
      ).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG,
      cacheTime: 5 * 60 * 1000, //5 minutes.
    }
  );
}
