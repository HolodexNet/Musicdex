import { Select } from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useServerOrgList } from "../../modules/services/statics.service";
import { useStoreActions, useStoreState } from "../../store";
import { Org } from "../../store/org";

export function OrgSelector() {
  const org = useStoreState((state) => state.org.currentOrg);
  const setOrg = useStoreActions((state) => state.org.setOrg);
  const orglist = useStoreState((s) => s.org.orgsList);

  const { data: orgs, isLoading } = useServerOrgList();
  const sortedOrgList = useMemo(() => {
    return orgs?.sort((a, b) => {
      const av = orglist[a.name];
      const bv = orglist[b.name];
      if (av !== undefined && bv !== undefined) {
        return av - bv;
      } else if (av !== undefined) return -1;
      else if (bv !== undefined) return 1;
      else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [orglist, orgs]);

  return (
    <motion.div
      style={{ opacity: 0, position: "relative" }}
      animate={{
        scale: [0.9, 1],
        opacity: [0, 1],
        marginTop: ["-30px", "-5px"],
      }}
      exit={{ opacity: 0, marginTop: "0px", height: "0px" }}
      transition={{ duration: 0.4, type: "tween" }}
    >
      <Select
        placeholder="Select org"
        value={org.name}
        onChange={(e) => {
          const tgt = sortedOrgList?.find((x) => x.name === e.target.value);
          if (tgt) setOrg(tgt);
        }}
        mb={3}
        fontFamily="Assistant, sans-serif"
        width="89%"
        pl="11%"
      >
        {sortedOrgList?.map((x) => {
          return (
            <option key={x.name + "opt_os"} value={x.name}>
              {x.name}
            </option>
          );
        })}
      </Select>
    </motion.div>
  );
}
