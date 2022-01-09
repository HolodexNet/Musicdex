// orgs.ts manages front page org settings
import { action, Action } from "easy-peasy";

export interface Org {
  name: string;
  name_jp?: string;
  short: string;
}

export interface OrgModel {
  currentOrg: Org;
  setOrg: Action<OrgModel, Org>;

  orgsList: Record<string, number>;
  setOrgsList: Action<OrgModel, string[]>;
}

const orgModel: OrgModel = {
  currentOrg: { name: "Hololive", name_jp: "Hololive", short: "" },

  setOrg: action((state, target) => {
    state.currentOrg = target;
  }),

  orgsList: {
    Hololive: -12669,
    Independents: -7791,
    Nijisanji: -2243,
    "Riot Music": -636,
    KAMITSUBAKI: -430,
    "774inc": -400,
    GuildCQ: -283,
    ReACT: -184,
  },
  setOrgsList: action((state, order) => {
    state.orgsList = Object.fromEntries(order.map((x, i) => [x, i]));
  }),
};

export default orgModel;
