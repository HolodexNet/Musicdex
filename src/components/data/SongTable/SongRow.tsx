import {
  useColorModeValue,
  Flex,
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CSSObject } from "@emotion/react";
import React, { useCallback } from "react";
import { useMemo, useState } from "react";
import { useContextMenu } from "react-contexify";
import { FiMoreHorizontal } from "react-icons/fi";
import { SongTableCol } from ".";
import { useStoreActions } from "../../../store";
import { SongArtwork } from "../../song/SongArtwork";
import { SongLikeButton } from "../../song/SongLikeButton";
import { useDraggableSong } from "../DraggableSong";
import { DurationGrid } from "./DurationCell";
import { IdxGrid } from "./IdxCell";
import { SangOnGrid } from "./SangOnCell";
import { TitleGrid } from "./TitleCell";

export interface RowProps {
  songClicked?: (e: React.MouseEvent, s: Song, idx: number) => void;
  showArtwork?: boolean;
  flipNames?: boolean;
  hideCol?: SongTableCol[];
  indexShift?: number;
}

export const SongRow = React.memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: any;
    data: {
      songList: Song[];
      playlist?: PlaylistFull;
      menuId: any;
      rowProps?: RowProps;
    };
  }) => {
    // const { t } = useTranslation();
    const song = useMemo(() => data.songList[index], [data.songList, index]);
    const queueSongs = useStoreActions(
      (actions) => actions.playback.queueSongs
    );
    const { show } = useContextMenu({ id: data.menuId });
    const rowProps = data.rowProps;
    const HOVER_ROW_STYLE: CSSObject = {
      backgroundColor: useColorModeValue("bgAlpha.200", "bgAlpha.800"),
    };
    const dragSongProps = useDraggableSong(song);
    const setPlaylist = useStoreActions(
      (actions) => actions.playback.setPlaylist
    );
    const [hoveredRowIndex, setHoveredRowIndex] = useState(false);
    const hideCol = rowProps?.hideCol;
    const clickFn = useCallback(
      (e: React.MouseEvent) => {
        if (rowProps?.songClicked) {
          rowProps.songClicked(e, song, index);
          return;
        }
        if (data.playlist && !rowProps?.songClicked) {
          setPlaylist({
            playlist: data.playlist,
            startPos: data.playlist.content?.findIndex((s) => s.id === song.id),
          });
        } else {
          queueSongs({ songs: [song], immediatelyPlay: true });
        }
      },
      [data.playlist, index, queueSongs, rowProps, setPlaylist, song]
    );
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
          transition="all 0.2s ease-out"
          _hover={HOVER_ROW_STYLE}
          onMouseEnter={() => setHoveredRowIndex(true)}
          onMouseLeave={() => setHoveredRowIndex(false)}
        >
          {/* IDX: */}
          {!hideCol?.includes("idx") ? (
            <Box width="30px" margin="auto">
              <IdxGrid
                id={index + (rowProps?.indexShift || 0)}
                songId={song.id}
                active={hoveredRowIndex}
                onPlayClick={clickFn}
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
            <Box
              flex="1 1 60px"
              noOfLines={1}
              px={2}
              margin="auto"
              opacity={0.8}
            >
              {song.original_artist}
            </Box>
          ) : undefined}
          {!hideCol?.includes("duration") ? (
            <Box
              flex="0 1 80px"
              noOfLines={1}
              textAlign="right"
              margin="auto"
              opacity={0.8}
            >
              <DurationGrid song={song} />
            </Box>
          ) : undefined}
          {!hideCol?.includes("sang_on") ? (
            <Box
              flex="0 1 150px"
              noOfLines={2}
              textAlign="right"
              margin="auto"
              opacity={0.8}
            >
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
);
