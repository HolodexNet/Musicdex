import { Select } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useStoreActions, useStoreState } from "../../store";
import { Org } from "../../store/org";

export function OrgSelector() {
  const org = useStoreState((state) => state.org.currentOrg);
  const setOrg = useStoreActions((state) => state.org.setOrg);

  const { data, isLoading } = useQuery<Org[]>(
    ["orgs"],
    async () => {
      const list: any[] = (await axios.get("/api/statics/orgs.json")).data;
      // list.unshift({ name: "All Vtubers", name_jp: "", short: "All" });
      return list;
    },
    {
      cacheTime: 1000 * 60 * 60 * 3,
    }
  );

  return (
    <Select
      placeholder="Select org"
      value={org.name}
      onChange={(e) => {
        const tgt = data?.find((x) => x.name === e.target.value);
        if (tgt) setOrg(tgt);
      }}
      mb={3}
      mt={-3}
      fontFamily="Assistant, sans-serif"
      width="89%"
      pl="11%"
    >
      {data?.map((x) => {
        return (
          <option key={x.name + "opt_os"} value={x.name}>
            {x.name}
          </option>
        );
      })}
    </Select>
  );
}
