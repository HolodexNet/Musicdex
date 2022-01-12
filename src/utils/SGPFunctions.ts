var qs = require("querystringify");

type PlaylistLike = Partial<PlaylistFull>;

interface SGPDef<DescriptionType, IDParams> {
  paramParser: (id: string) => IDParams;
  descParser: (x: string | undefined) => DescriptionType | undefined;
}
interface SGPDefMap {
  ":dailyrandom": SGPDef<Channel, { ch: string }>;
  ":weekly": SGPDef<{ org: string }, { org: string }>;
  ":userweekly": SGPDef<{ user: string | number }, { user: string | number }>;
  ":history": SGPDef<{ user: string | number }, { user: string | number }>;
  ":video": SGPDef<{ id: string }, { id: string }>;
  ":latest": SGPDef<{ org: string }, { org: string }>;
  ":mv": SGPDef<
    { org: string; sort: "recent" | "random" },
    { org: string; sort: "recent" | "random" }
  >;
}

const DEFAULT_PARAM_PARSER = (playlistId: string) =>
  parsePlaylistID(playlistId).params;
const DEFAULT_DISC_PARSER = <T1>(x: string | undefined) =>
  x ? (JSON.parse(x) as T1) : undefined;

const DEF_PARSER_GROUP = {
  descParser: DEFAULT_DISC_PARSER,
  paramParser: DEFAULT_PARAM_PARSER,
};

export const SGPDefinitions: SGPDefMap = {
  ":dailyrandom": DEF_PARSER_GROUP,
  ":weekly": DEF_PARSER_GROUP,
  ":userweekly": DEF_PARSER_GROUP,
  ":history": DEF_PARSER_GROUP,
  ":video": DEF_PARSER_GROUP,
  ":latest": DEF_PARSER_GROUP,
  ":mv": DEF_PARSER_GROUP,
};

interface SGPTransformer<Out> {
  ":dailyrandom"?: (
    playlist: PlaylistLike,
    id: { ch: string },
    data: { channel: Channel } | undefined
  ) => Out;
  ":weekly"?: (
    playlist: PlaylistLike,
    id: { org: string },
    data: { org: string } | undefined
  ) => Out;
  ":userweekly"?: (
    playlist: PlaylistLike,
    id: { user: string | number },
    data: { user: string | number } | undefined
  ) => Out;
  ":history"?: (
    playlist: PlaylistLike,
    id: { user: string | number },
    data: { user: string | number } | undefined
  ) => Out;
  ":video"?: (
    playlist: PlaylistLike,
    id: { id: string },
    data: { id: string; title: string } | undefined
  ) => Out;
  ":mv"?: (
    playlist: PlaylistLike,
    id: { org: string },
    data: { org: string } | undefined
  ) => Out;
  ":latest"?: (
    playlist: PlaylistLike,
    id: { org: string },
    data: { org: string; sort: "recent" | "random" } | undefined
  ) => Out;
}

export function extractUsingFn<Out>(
  playlist: PlaylistLike,
  transformers: SGPTransformer<Out>
) {
  const { type, params } = parsePlaylistID(playlist.id!);
  return transformers?.[type]?.(
    playlist,
    params,
    (playlist?.description
      ? SGPDefinitions?.[type]?.descParser?.(playlist?.description)
      : undefined) as any
  );
}

export function isSGPPlaylist(playlistId: string) {
  return playlistId.startsWith(":");
}

const IDSplitter = /[[\]]/;

/**
 * Parses a SGP id
 * @param id id string
 * @returns generator type and params object
 */
export function parsePlaylistID(id: string): {
  type: keyof SGPDefMap;
  params: any;
} {
  const [type, paramString] = id.split(IDSplitter);
  return {
    type: type as any,
    params: paramString ? qs.parse(paramString) : {},
  };
}

/**
 * Formats an SGP to string id
 * @param type generator type
 * @param params any playlist params
 * @returns string id
 */
export function formatPlaylistID(
  type: keyof SGPDefMap,
  params: Record<string, any>
) {
  return `${type}[${qs.stringify(params)}]`;
}
