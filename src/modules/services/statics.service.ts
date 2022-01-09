import axios from "axios";
import { useQuery } from "react-query";
import { Org } from "../../store/org";

export function useServerOrgList() {
  return useQuery<Org[]>(
    ["orgs"],
    async () => {
      const list: any[] = (await axios.get("/api/statics/orgs.json")).data;
      // list.unshift({ name: "All Vtubers", name_jp: "", short: "All" });
      return list;
    },
    {
      cacheTime: 1000 * 60 * 60 * 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      refetchOnReconnect: false,
    }
  );
}
