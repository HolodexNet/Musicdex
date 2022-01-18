import {
  Box,
  BoxProps,
  CSSObject,
  Flex,
  Icon,
  IconButton,
  Text,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
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
import AutoSizer from "react-virtualized-auto-sizer";
import memoize from "memoize-one";
import { SongLikeButton } from "../song/SongLikeButton";

interface SongTableProps {
  songs: Song[];

  // reactive hooks:
  songClicked?: (e: React.MouseEvent, s: Song) => void;
  songDropdownMenuRenderer?: (cellInfo: any) => JSX.Element;
  virtualized?: boolean;

  menuId?: string;
}

const IdxGrid = ({ id, songId }: { id: number; songId: string }) => {
  const currentId = useStoreState(
    (state) => state.playback.currentlyPlaying?.song?.id
  );

  return songId === currentId ? (
    <NowPlayingIcon style={{ color: "var(--chakra-colors-n2-400)" }} />
  ) : (
    <span>{id + 1}</span>
  );
};

const TitleGrid = ({
  song, //: { original, channel },
}: {
  song: Song;
  // row: { original: Song; channel: string };
}) => {
  const tn = useNamePicker();

  return (
    <VStack alignItems="start" spacing={0}>
      <Box style={{ cursor: "default" }} noOfLines={1} title={song.name}>
        {song.name}
      </Box>
      <Text
        opacity={0.66}
        fontWeight={300}
        fontSize="sm"
        as={Link}
        to={"/channel/" + song.channel_id}
        onClick={(e) => {
          e.stopPropagation();
        }}
        _hover={{ opacity: 0.9 }}
      >
        {tn(song.channel?.english_name, song.channel?.name)}
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
const columns = ["#", "Title", "Original Artist", "Duration", "Sang On", "..."];

const memoized = memoize(
  (
    songList: Song[],
    songMenuRenderer?: (cellInfo: any) => JSX.Element,
    menuId?: any,
    songClicked?: (e: React.MouseEvent, s: Song) => void
  ) => ({
    songList,
    songMenuRenderer,
    menuId,
    songClicked,
  })
);
export const SongTable = ({
  songs,
  songClicked,
  songDropdownMenuRenderer,
  menuId = DEFAULT_MENU_ID,
  virtualized = false,
  ...rest
}: SongTableProps & BoxProps) => {
  const { t } = useTranslation();
  // const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  // const indexedSongs: IndexedSong[] = React.useMemo(() => {
  //   return songs.map((v, i) => {
  //     return { ...v, idx: i + 1 };
  //   });
  // }, [songs]);

  // useEffect(() => {
  //   if (isXL === undefined) return;
  //   toggleHideColumn("original_artist", isXL < 3);
  //   toggleHideColumn("idx", isXL < 3);
  //   toggleHideColumn("date", isXL < 2);
  //   toggleHideColumn("dur", isXL < 1);
  // }, [isXL, toggleHideColumn]);

  const columns = [
    "#",
    "Title",
    "Original Artist",
    "Duration",
    "Sang On",
    "...",
  ];

  const data = memoized(songs, songDropdownMenuRenderer, menuId, songClicked);

  // const defaultClickBehavior = useCallback(
  //   (e: React.MouseEvent<any, MouseEvent>, song: Song) => {
  //     queueSongs({
  //       songs: [song],
  //       immediatelyPlay: true,
  //     });
  //   },
  //   [queueSongs]
  // );

  return (
    <Flex flex="1" flexDirection="column">
      <Box {...rest} height="100%">
        {virtualized ? (
          <AutoSizer disableWidth defaultWidth="100%" defaultHeight={200}>
            {({ height, width }: { height: number; width: number }) => (
              // console.log(height);
              <FixedSizeList
                height={height}
                width={width}
                itemCount={songs.length}
                itemSize={60}
                itemData={data}
              >
                {MemoizedRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        ) : (
          data.songList.map((song, index) => (
            <MemoizedRow
              data={data}
              index={index}
              style={{}}
              key={`${data.menuId}${index}`}
            />
          ))
        )}
      </Box>
    </Flex>
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
    songMenuRenderer: ((cellInfo: any) => JSX.Element) | undefined;
    menuId: any;
    songClicked: ((e: React.MouseEvent, s: Song) => void) | undefined;
  };
}) {
  // const { t } = useTranslation();
  const song = useMemo(() => data.songList[index], [data.songList, index]);
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  const { show } = useContextMenu({ id: data.menuId });
  const detailLevel = useBreakpointValue(
    {
      base: 0,
      xs: 0,
      sm: 1,
      md: 2,
      xl: 3,
    },
    "xl"
  );

  const HOVER_ROW_STYLE: CSSObject = {
    backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
  };
  const dragSongProps = useDraggableSong(song);

  const dropDownUsageFn = React.useMemo(
    () =>
      data.songMenuRenderer ? (
        data.songMenuRenderer(song)
      ) : (
        <IconButton
          //   py={2}
          icon={<FiMoreHorizontal />}
          rounded="full"
          size="sm"
          // mr={-2}
          ml={2}
          variant="ghost"
          colorScheme="n2"
          aria-label="More"
          onClick={(e) => show(e, { props: song })}
        ></IconButton>
      ),
    [data, show, song]
  );

  return (
    <div style={style}>
      <Flex
        height="100%"
        py={1.5}
        px={2}
        {...dragSongProps}
        onContextMenu={(e) => show?.(e, { props: song })}
        onClick={(e) =>
          data.songClicked
            ? data.songClicked(e, song)
            : queueSongs({ songs: [song], immediatelyPlay: true })
        }
        borderTop="1px solid var(--chakra-colors-whiteAlpha-200)"
        boxSizing="border-box"
        _hover={HOVER_ROW_STYLE}
      >
        {/* IDX: */}
        {detailLevel && detailLevel >= 3 ? (
          <Box width="30px" margin="auto">
            <IdxGrid id={index} songId={song.id} />
          </Box>
        ) : undefined}
        <Box flex="1.4 1 90px" px={2} margin="auto">
          <TitleGrid song={song} />
        </Box>
        {detailLevel && detailLevel >= 3 ? (
          <Box flex="1 1 60px" noOfLines={2} px={2} margin="auto">
            {song.original_artist}
          </Box>
        ) : undefined}
        {detailLevel && detailLevel >= 1 ? (
          <Box flex="0 1 80px" noOfLines={1} textAlign="right" margin="auto">
            <DurationGrid song={song} />
          </Box>
        ) : undefined}
        {detailLevel && detailLevel >= 2 ? (
          <Box flex="0 1 150px" noOfLines={2} textAlign="right" margin="auto">
            <SangOnGrid value={new Date(song.available_at)} />
          </Box>
        ) : undefined}
        <Box flex="0 0 90px" textAlign="right" margin="auto">
          <SongLikeButton song={song} />
          {dropDownUsageFn}
        </Box>
      </Flex>
    </div>
  );
}
