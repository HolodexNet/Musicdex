import { Box, BoxProps, Button, useBreakpointValue } from "@chakra-ui/react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { FixedSizeList } from "react-window";
import WindowScroller from "react-virtualized/dist/es/WindowScroller";
import { DEFAULT_MENU_ID } from "../../song/SongContextMenu";
import { FrameRef } from "../../layout/Frame";
import { RowProps, SongRow } from "./SongRow";

export type SongTableCol =
  | "idx"
  | "title"
  | "og_artist"
  | "duration"
  | "sang_on"
  | "menu";

interface SongTableProps {
  songs?: Song[];
  playlist?: PlaylistFull;
  // reactive hooks:
  songDropdownMenuRenderer?: (cellInfo: any) => JSX.Element;
  virtualized?: boolean;
  appendRight?: React.ReactNode;
  menuId?: string;
  rowProps?: RowProps;
  limit?: number;
}

export const useResponseSongRow = () => {
  return useBreakpointValue<SongTableCol[] | undefined>(
    {
      base: ["idx", "og_artist", "sang_on", "duration"],
      sm: ["idx", "og_artist", "sang_on"],
      md: ["idx", "og_artist"],
      lg: [],
      xl: [],
    },
    "xl"
  );
};
export const SongTable = ({
  songs,
  menuId = DEFAULT_MENU_ID,
  virtualized = false,
  rowProps,
  playlist,
  limit,
  appendRight,
  ...rest
}: SongTableProps & BoxProps) => {
  const detailLevel = useResponseSongRow();
  const songList = playlist?.content || songs;
  const data: {
    songList: Song[];
    menuId: any;
    rowProps?: RowProps;
    playlist?: PlaylistFull;
  } = useMemo(
    () => ({
      songList: songList ?? [],
      menuId,
      playlist,
      rowProps: { ...rowProps, hideCol: rowProps?.hideCol ?? detailLevel },
    }),
    [detailLevel, menuId, playlist, rowProps, songList]
  );
  const frameRef = useContext(FrameRef);
  const list = React.useRef<any>(null);
  const [expanded, setExpanded] = useState(false);
  const onScroll = useCallback(({ scrollTop }) => {
    list.current?.scrollTo(scrollTop);
  }, []);
  if (!songList) return <>No Songs</>;

  return virtualized ? (
    <WindowScroller onScroll={onScroll} scrollElement={frameRef.current}>
      {({ height }) => {
        return (
          <FixedSizeList
            height={height || frameRef.current.getBoundingClientRect().height}
            width="100%"
            itemCount={songList.length}
            itemSize={60}
            itemData={data}
            ref={list}
            style={{ height: "100vh !important" }}
          >
            {SongRow}
          </FixedSizeList>
        );
      }}
    </WindowScroller>
  ) : (
    <Box {...rest}>
      {songList
        .slice(0, (!expanded && limit) || songList.length)
        .map((song, index) => (
          <SongRow
            data={data}
            index={index}
            style={{}}
            key={`${data.menuId}${song.id}`}
          />
        ))}
      <Box my={1}>
        {limit && songList.length > limit && (
          <Button
            onClick={() => setExpanded((prev) => !prev)}
            variant="ghost"
            fontWeight={600}
            colorScheme="gray"
            textColor="gray.400"
            textTransform="uppercase"
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
        {appendRight}
      </Box>
    </Box>
  );
};
