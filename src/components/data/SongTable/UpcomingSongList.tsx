import {
  Box,
  BoxProps,
  Flex,
  IconButton,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { VariableSizeList } from "react-window";
import { DEFAULT_MENU_ID, QUEUE_MENU_ID } from "../../song/SongContextMenu";
import { RowProps, SongRow } from "./SongRow";
import { useTranslation } from "react-i18next";
import { SongTableCol, SongTableProps } from ".";
import { t } from "i18next";
import { FiFolderPlus, FiTrash } from "react-icons/fi";
import { TbArrowsUpDown } from "react-icons/tb";
import { useStoreActions, useStoreState } from "../../../store";
import { useFormatPlaylist } from "../../../modules/playlist/useFormatPlaylist";
import WindowScroller from "react-virtualized/dist/es/WindowScroller";
import AutoSizer from "react-virtualized/dist/es/AutoSizer";

import { FrameRef } from "../../layout/Frame";

interface UpcomingSongTableProps extends SongTableProps {
  queue: Song[];
  useWindowScroller?: boolean;
}

interface RawRowProps {
  queueLength: number;
  songList: Song[];
  playlist?: PlaylistFull;
  menuId: any;
  rowProps?: RowProps;
}

interface RowWithHeader {
  index: number;
  style: any;
  data: RawRowProps;
}

// Overload row rendering to render headers when needed
const Row = (props: RowWithHeader) => {
  const data =
    props.index < props.data.queueLength
      ? {
          ...props.data,
          menuId: QUEUE_MENU_ID,
        }
      : props.data;
  if (props.index === 0 || props.index === props.data.queueLength) {
    return (
      <Box style={props.style}>
        {props.index === 0 && props.data.queueLength !== 0 ? (
          <QueueHeader />
        ) : (
          <PlaylistHeader />
        )}
        <SongRow index={props.index} style={{}} data={data} />
      </Box>
    );
  }
  return <SongRow index={props.index} style={props.style} data={data} />;
};

const QueueHeader = () => {
  const queue = useStoreState((state) => state.playback.queue);
  const showAddDialog = useStoreActions(
    (action) => action.playlist.showPlaylistAddDialog,
  );
  const clearQueue = useStoreActions((actions) => actions.playback._queueClear);
  const reverseQueue = useStoreActions(
    (actions) => actions.playback.queueReverse,
  );

  return (
    <Flex mt={4} gap={1} alignItems="center">
      <Text fontSize={["md", "lg"]} noOfLines={1}>
        <Text opacity={0.66} as={"span"}>
          {t("Queue")}
        </Text>
      </Text>
      <Spacer />
      <IconButton
        aria-label="reverse playlist"
        icon={<TbArrowsUpDown />}
        colorScheme="whiteAlpha"
        color="white"
        variant="ghost"
        onClick={() => reverseQueue()}
      />
      <IconButton
        aria-label="add to playlist"
        icon={<FiFolderPlus />}
        colorScheme="whiteAlpha"
        color="white"
        variant="ghost"
        onClick={() => showAddDialog(queue)}
      />
      <IconButton
        aria-label="clear playlist"
        icon={<FiTrash />}
        colorScheme="red"
        variant="ghost"
        onClick={() => clearQueue()}
      />
    </Flex>
  );
};

const PlaylistHeader = () => {
  const clearPlaylist = useStoreActions(
    (actions) => actions.playback.clearPlaylist,
  );

  const formatPlaylist = useFormatPlaylist();
  const currentPlaylist = useStoreState((s) => s.playback.currentPlaylist);
  const reversePlaylist = useStoreActions(
    (actions) => actions.playback.reversePlaylist,
  );

  const { currentTitle, urlLinkToPlaylist } = useMemo(
    () => ({
      currentTitle: currentPlaylist && formatPlaylist("title", currentPlaylist),
      urlLinkToPlaylist:
        currentPlaylist && formatPlaylist("link", currentPlaylist),
    }),
    [currentPlaylist, formatPlaylist],
  );
  return (
    <Flex mt={4} gap={1} alignItems="center">
      <Text fontSize={["md", "lg"]} noOfLines={1}>
        <Text opacity={0.66} as={"span"}>
          {currentPlaylist?.type.startsWith("radio")
            ? t("Radio")
            : t("Playlist")}
          :&nbsp;
        </Text>
        <Text
          fontWeight={600}
          as={Link}
          to={urlLinkToPlaylist || "#"}
          _hover={{ textDecoration: "underline" }}
        >
          {currentTitle}
        </Text>
      </Text>
      <Spacer />
      <IconButton
        aria-label="reverse playlist"
        icon={<TbArrowsUpDown />}
        colorScheme="whiteAlpha"
        color="white"
        variant="ghost"
        onClick={() => reversePlaylist()}
      />
      <IconButton
        aria-label="clear playlist"
        icon={<FiTrash />}
        colorScheme="red"
        variant="ghost"
        onClick={() => clearPlaylist()}
      ></IconButton>
    </Flex>
  );
};

export const UpcomingSongList = ({
  menuId = DEFAULT_MENU_ID,
  rowProps,
  songs,
  queue,
  playlist,
  useWindowScroller = false,
}: UpcomingSongTableProps & BoxProps) => {
  const { t } = useTranslation();
  const detailLevel = useMemo<SongTableCol[]>(
    () => ["idx", "og_artist", "sang_on"],
    [],
  );
  const songList = useMemo<Song[]>(
    () => [...queue, ...(songs || [])],
    [queue, songs],
  );
  const data: RawRowProps = useMemo(
    () => ({
      queueLength: queue.length,
      songList: songList ?? [],
      menuId,
      playlist,
      rowProps: { ...rowProps, hideCol: rowProps?.hideCol ?? detailLevel },
    }),
    [detailLevel, menuId, playlist, queue.length, rowProps, songList],
  );
  const list = React.useRef<any>(null);

  useEffect(() => {
    // Hint at VariableSizeList to recheck row heights after queue length changed
    list.current?.resetAfterIndex(queue.length);
  }, [queue.length]);

  const frameRef = useContext(FrameRef);
  const onScroll = useCallback(
    ({ scrollTop }: { scrollLeft: number; scrollTop: number }) => {
      list.current?.scrollTo(scrollTop);
    },
    [],
  );

  const renderList = useCallback(
    ({ height, width }: { height: number; width: number }) => (
      // @ts-ignore React 18 typings issue
      <VariableSizeList
        height={height || 800}
        width={useWindowScroller ? "100%" : width}
        itemCount={songList.length}
        itemSize={(index: number) => {
          // This row contains both a header AND a song row, double its size
          if (index === 0 || index === queue.length) return 120;
          return 60;
        }}
        itemData={data}
        ref={list}
        style={useWindowScroller ? { height: "100vh !important" } : {}}
      >
        {Row}
      </VariableSizeList>
    ),
    [data, queue.length, songList.length, useWindowScroller],
  );

  if (!songList) return <>{t("No Songs")}</>;
  return (
    <Box height="100%" width="100%">
      {!useWindowScroller ? (
        // @ts-ignore
        <AutoSizer>{renderList}</AutoSizer>
      ) : (
        // @ts-ignore
        <WindowScroller onScroll={onScroll} scrollElement={frameRef?.current}>
          {renderList}
        </WindowScroller>
      )}
    </Box>
  );
};
