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
}

const DEFAULT_PARAM_PARSER = (id: string) => parsePlaylistID(id).params;
const DEFAULT_DISC_PARSER = <T1>(x: string | undefined) =>
  x ? (JSON.parse(x) as T1) : undefined;

const SGPDefinitions: SGPDefMap = {
  ":dailyrandom": {
    descParser: DEFAULT_DISC_PARSER,
    paramParser: DEFAULT_PARAM_PARSER,
  },
  ":weekly": {
    descParser: DEFAULT_DISC_PARSER,
    paramParser: DEFAULT_PARAM_PARSER,
  },
  ":userweekly": {
    descParser: DEFAULT_DISC_PARSER,
    paramParser: DEFAULT_PARAM_PARSER,
  },
};

interface SGPTransformer<Out> {
  ":dailyrandom": (
    playlist: PlaylistLike,
    id: { ch: string },
    data: { channel: Channel } | undefined
  ) => Out;
  ":weekly": (
    playlist: PlaylistLike,
    id: { org: string },
    data: { org: string } | undefined
  ) => Out;
  ":userweekly": (
    playlist: PlaylistLike,
    id: { user: string | number },
    data: { user: string | number } | undefined
  ) => Out;
}

export function extractUsingFn<Out>(
  playlist: PlaylistLike,
  transformers: SGPTransformer<Out>
) {
  const { type, params } = parsePlaylistID(playlist.id!);
  return transformers[type](
    playlist,
    params,
    <any>(
      (playlist?.description
        ? SGPDefinitions[type].descParser(playlist?.description)
        : undefined)
    )
  );
}

export function isSGPPlaylist(playlistId: string) {
  return playlistId.startsWith(":");
}

const IDSplitter = /[\[\]]/;

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
    type: <any>type,
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
