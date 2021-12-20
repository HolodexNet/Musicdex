// orgs.ts manages front page org settings
import { action, Action, computed, Computed } from "easy-peasy";

export interface Org {
  name: string;
  name_jp?: string;
  short: string;
}

export interface OrgModel {
  currentOrg: Org;

  setOrg: Action<OrgModel, Org>;
}

const orgModel: OrgModel = {
  currentOrg: { name: "All VTubers", name_jp: "全サイト", short: "" },

  setOrg: action((state, target) => {
    state.currentOrg = target;
  }),
};

export default orgModel;
