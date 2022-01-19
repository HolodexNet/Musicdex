import {
  Box,
  BoxProps,
  CSSObject,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { ContextMenuParams, useContextMenu } from "react-contexify";
import { useTranslation } from "react-i18next";
import { BiMovie } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";
import { areEqual, FixedSizeList } from "react-window";
import useNamePicker from "../../modules/common/useNamePicker";
import { useStoreActions, useStoreState } from "../../store";
import { formatSeconds } from "../../utils/SongHelper";
import { DEFAULT_MENU_ID } from "../common/CommonContext";
import { NowPlayingIcon } from "../common/NowPlayingIcon";
import { useDraggableSong } from "./DraggableSong";
import memoize from "memoize-one";
import { SongLikeButton } from "../song/SongLikeButton";
import WindowScroller from "react-virtualized/dist/es/WindowScroller";
import { FrameRef } from "../layout/Frame";
import { FaPlay } from "react-icons/fa";
import { MotionBox } from "../common/MotionBox";
import { SongArtwork } from "../song/SongArtwork";

export type SongTableCol =
  | "idx"
  | "title"
  | "og_artist"
  | "duration"
  | "sang_on"
  | "menu";

interface SongTableProps {
  songs: Song[];
  // reactive hooks:
  songDropdownMenuRenderer?: (cellInfo: any) => JSX.Element;
  virtualized?: boolean;

  menuId?: string;
  rowProps?: RowProps;
}
interface RowProps {
  songClicked?: (e: React.MouseEvent, s: Song) => void;
  showArtwork?: boolean;
  flipNames?: boolean;
  hideCol?: SongTableCol[];
}

const IdxGrid = ({
  id,
  songId,
  active,
  onPlayClick,
}: {
  id: number;
  songId: string;
  active: boolean;
  onPlayClick: (e: any) => void;
}) => {
  const currentId = useStoreState(
    (state) => state.playback.currentlyPlaying?.song?.id
  );
  switch (true) {
    case songId === currentId:
      return (
        <NowPlayingIcon style={{ color: "var(--chakra-colors-n2-400)" }} />
      );
    case active:
      return (
        <MotionBox
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          color="brand.400"
          _hover={{ color: "brand.200" }}
          onClick={onPlayClick}
          cursor="pointer"
          marginLeft="1px"
        >
          <FaPlay />
        </MotionBox>
      );
    default:
      return <span>{id + 1}</span>;
  }
};

const TitleGrid = ({
  song, //: { original, channel },
  onTitleClick,
  flipNames,
}: {
  song: Song;
  onTitleClick: (e: any) => void;
  flipNames?: boolean;
  // row: { original: Song; channel: string };
}) => {
  const tn = useNamePicker();

  return (
    <VStack alignItems="start" spacing={0}>
      <Box
        noOfLines={1}
        title={song.name}
        onClick={onTitleClick}
        cursor="pointer"
      >
        {song.name}
      </Box>
      <Text
        opacity={0.66}
        fontWeight={300}
        fontSize="sm"
        as={Link}
        to={flipNames ? "" : "/channel/" + song.channel_id}
        onClick={(e) => {
          e.stopPropagation();
        }}
        _hover={{ opacity: 0.9 }}
      >
        {flipNames
          ? song.original_artist
          : tn(song.channel?.english_name, song.channel?.name)}
      </Text>
    </VStack>
  );
};

const DurationGrid = ({ song }: { song: Song }) => {
  return (
    <>
      {song.is_mv && (
        <Icon mb="-3px" mr={3} as={BiMovie} title="MV" color="gray.500"></Icon>
      )}{" "}
      {formatSeconds(song.end - song.start)}
    </>
  );
};

const SangOnGrid = ({ value }: { value: Date }) => {
  const { t } = useTranslation();
  return (
    <span title={t("NO_TL.absoluteDate", { date: value })}>
      {t("NO_TL.relativeDate", { date: value })}
    </span>
  );
};

const memoized = memoize(
  (songList: Song[], menuId?: any, rowProps?: RowProps) => ({
    songList,
    menuId,
    rowProps,
  })
);
export const SongTable = ({
  songs,
  menuId = DEFAULT_MENU_ID,
  virtualized = false,
  rowProps,
  ...rest
}: SongTableProps & BoxProps) => {
  const { t } = useTranslation();
  const detailLevel = useBreakpointValue<SongTableCol[] | undefined>(
    {
      base: ["idx", "og_artist", "sang_on", "duration"],
      sm: ["idx", "og_artist", "sang_on"],
      md: ["idx", "og_artist"],
      xl: undefined,
    },
    "xl"
  );
  const props = useMemo(
    () => ({ ...rowProps, hideCol: rowProps?.hideCol ?? detailLevel }),
    [detailLevel, rowProps]
  );
  const data = memoized(songs, menuId, props);
  const frameRef = useContext(FrameRef);
  const list = React.useRef<any>(null);
  const onScroll = useCallback(({ scrollTop }) => {
    list.current?.scrollTo(scrollTop);
  }, []);

  return virtualized ? (
    <>
      <WindowScroller onScroll={onScroll} scrollElement={frameRef.current}>
        {({ height }) => {
          return (
            <FixedSizeList
              height={height || frameRef.current.getBoundingClientRect().height}
              width="100%"
              itemCount={songs.length}
              itemSize={60}
              itemData={data}
              ref={list}
              style={{ height: "100vh !important" }}
            >
              {MemoizedRow}
            </FixedSizeList>
          );
        }}
      </WindowScroller>
    </>
  ) : (
    <Box>
      {songs.map((song, index) => (
        <MemoizedRow
          data={data}
          index={index}
          style={{}}
          key={`${data.menuId}${song.id}`}
        />
      ))}
    </Box>
  );
};
const MemoizedRow = React.memo(Row, areEqual);

function Row({
  index,
  style,
  data,
}: {
  index: number;
  style: any;
  data: {
    songList: Song[];
    menuId: any;
    rowProps?: RowProps;
  };
}) {
  // const { t } = useTranslation();
  console.log(data.songList, index);
  const song = useMemo(() => data.songList[index], [data.songList, index]);
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  const { show } = useContextMenu({ id: data.menuId });
  const rowProps = data.rowProps;
  const HOVER_ROW_STYLE: CSSObject = {
    backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
  };
  const dragSongProps = useDraggableSong(song);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(false);
  const hideCol = rowProps?.hideCol;
  const clickFn = (e: React.MouseEvent) =>
    rowProps?.songClicked
      ? rowProps.songClicked(e, song)
      : queueSongs({ songs: [song], immediatelyPlay: true });
  return (
    <div style={style}>
      <Flex
        height="100%"
        py={1.5}
        px={2}
        {...dragSongProps}
        onContextMenu={(e) => show?.(e, { props: song })}
        borderTop="1px solid var(--chakra-colors-whiteAlpha-200)"
        boxSizing="border-box"
        _hover={HOVER_ROW_STYLE}
        onMouseEnter={() => setHoveredRowIndex(true)}
        onMouseLeave={() => setHoveredRowIndex(false)}
      >
        {/* IDX: */}
        {!hideCol?.includes("idx") ? (
          <Box width="30px" margin="auto">
            <IdxGrid
              id={index}
              songId={song.id}
              active={hoveredRowIndex}
              onPlayClick={() =>
                queueSongs({ songs: [song], immediatelyPlay: true })
              }
            />
          </Box>
        ) : undefined}
        {!hideCol?.includes("title") && (
          <HStack flex="1.4 1 90px" px={2} margin="auto">
            {rowProps?.showArtwork && (
              <SongArtwork song={song} size={40} rounded="sm" />
            )}
            <TitleGrid
              song={song}
              onTitleClick={clickFn}
              flipNames={rowProps?.flipNames}
            />
          </HStack>
        )}
        {!hideCol?.includes("og_artist") ? (
          <Box flex="1 1 60px" noOfLines={2} px={2} margin="auto">
            {song.original_artist}
          </Box>
        ) : undefined}
        {!hideCol?.includes("duration") ? (
          <Box flex="0 1 80px" noOfLines={1} textAlign="right" margin="auto">
            <DurationGrid song={song} />
          </Box>
        ) : undefined}
        {!hideCol?.includes("sang_on") ? (
          <Box flex="0 1 150px" noOfLines={2} textAlign="right" margin="auto">
            <SangOnGrid value={new Date(song.available_at)} />
          </Box>
        ) : undefined}
        {!hideCol?.includes("menu") && (
          <Box
            flex="0 0 90px"
            textAlign="right"
            margin="auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SongLikeButton song={song} />
            <IconButton
              icon={<FiMoreHorizontal />}
              rounded="full"
              size="sm"
              ml={2}
              variant="ghost"
              colorScheme="n2"
              aria-label="More"
              onClick={(e) => show(e, { props: song })}
            ></IconButton>
          </Box>
        )}
      </Flex>
    </div>
  );
}
