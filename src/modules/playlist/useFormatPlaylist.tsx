import { useCallback } from "react";
import { TFunction, useTranslation } from "react-i18next";
import useNamePicker from "../common/useNamePicker";
import { formatters } from "./formatters";

// FIXME: Migrate to URLSearchParams
var qs = require("querystringify");

type PlaylistLike = Partial<PlaylistFull>;

type SGPTypes =
  | ":dailyrandom"
  | ":weekly"
  | ":userweekly"
  | ":history"
  | ":video"
  | ":latest"
  | ":mv";

type RadioTypes = ":artist" | ":hot";

const DEFAULT_PARAM_PARSER = (playlistId: string) =>
  parsePlaylistID(playlistId).params;
const DEFAULT_DISC_PARSER = <T1,>(x: string | undefined) => {
  if (x) {
    try {
      return JSON.parse(x) as T1;
    } catch (_) {
      return x;
    }
  } else return undefined;
};

const DEF_PARSER_GROUP = {
  descParser: DEFAULT_DISC_PARSER,
  paramParser: DEFAULT_PARAM_PARSER,
};

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
  type: SGPTypes | RadioTypes;
  params: any;
} {
  const [type, paramString] = id.split(IDSplitter);
  return {
    type: type as SGPTypes | RadioTypes,
    params: paramString ? qs.parse(paramString.split(",").join("&")) : {},
  };
}

/**
 * Formats an SGP to string id
 * @param type generator type
 * @param params any playlist params
 * @returns string id
 */
export function formatPlaylistID(
  type: SGPTypes | RadioTypes,
  params: Record<string, any>
) {
  return `${String(type)}[${qs.stringify(params)}]`;
}

type FormatFunctions =
  | "bannerImage"
  | "channelImage"
  | "title"
  | "description"
  | "link";

// Translation and name picker function
interface FormatContext {
  t: TFunction<"translation", undefined>;
  tn: (en: any, jp: any) => any;
}

export type PlaylistFnMap<Param, Desc> = {
  [k in FormatFunctions]?: (
    playlist: Partial<PlaylistFull>,
    params: Param,
    data: Desc,
    context: FormatContext
  ) => string | undefined;
};

export type PlaylistFormatter<Param, Desc> = PlaylistFnMap<Param, Desc> & {
  paramParser?: (playlistId: string) => Param;
  descParser?: (x: string | undefined) => Desc;
};

// Context aware format function
export function useFormatPlaylist() {
  const { t } = useTranslation();
  const tn = useNamePicker();

  return useCallback(
    (fn: FormatFunctions, playlist: PlaylistLike) =>
      formatPlaylist(fn, playlist, { t, tn }),
    [t, tn]
  );
}

export function usePlaylistTitleDesc(playlist: PlaylistLike | undefined) {
  const { t } = useTranslation();
  const tn = useNamePicker();
  if (!playlist) return {};
  return {
    title: formatPlaylist("title", playlist, { t, tn }),
    description: formatPlaylist("description", playlist, { t, tn }),
  };
}

// @TODO Ricecakes I have no idea what these formatters are doing. There's a formatters.default, why are we not using that? why use DEF_PARSER_GROUP?
export function parsePlaylistDesc(playlist: PlaylistLike) {
  if (isSGPPlaylist(playlist.id!)) {
    const { type } = parsePlaylistID(playlist.id!);
    const descParser =
      formatters[type]?.descParser || DEF_PARSER_GROUP.descParser;
    return descParser(playlist.description);
  }
  return playlist.description;
}

export function formatPlaylist(
  fn: FormatFunctions,
  playlist: PlaylistLike,
  // formatters: typeof formatters,
  context: FormatContext
) {
  if (!isSGPPlaylist(playlist.id!)) {
    return formatters.default[fn]?.(playlist, undefined, undefined, context);
  }
  const { type, params } = parsePlaylistID(playlist.id!);
  const formatFn = formatters[type]?.[fn] || formatters.default[fn];

  return formatFn?.(
    playlist,
    params,
    (playlist?.description ? parsePlaylistDesc(playlist) : undefined) as any,
    context
  );
}
