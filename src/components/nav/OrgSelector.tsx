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

  const usableOrgs = useMemo(() => {
    return orglist
      ? (orglist
          .map((x) => orgs?.find((o) => o.name === x))
          .filter((x) => !!x) as Org[])
      : [];
  }, [orglist, orgs]);
  // CSS for .orgselector is in global.css
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
      className="orgselector"
    >
      <select
        placeholder="Select org"
        value={org.name}
        onChange={(e) => {
          const tgt = orgs?.find((x) => x.name === e.target.value);
          if (tgt) setOrg(tgt);
        }}
        // mb={3}
        // fontFamily="Assistant, sans-serif"
        // width="89%"
        // pl="11%"
      >
        {usableOrgs?.map((x) => {
          return (
            <option key={x.name + "opt_os"} value={x.name}>
              {x.name}
            </option>
          );
        })}
      </select>
    </motion.div>
  );
}
