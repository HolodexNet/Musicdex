import { Flex, Heading, Spacer } from "@chakra-ui/layout";
import { IconButton, Text } from "@chakra-ui/react";
import React, { Suspense, useMemo } from "react";
import { FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  DEFAULT_MENU_ID,
  QUEUE_MENU_ID,
  SongContextMenu,
} from "../components/song/SongContextMenu";
import { SongTable, useResponseSongRow } from "../components/data/SongTable";
import { SongRow } from "../components/data/SongTable/SongRow";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useFormatPlaylist } from "../modules/playlist/useFormatPlaylist";
import { useStoreActions, useStoreState } from "../store";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

export const Queue = React.memo(() => {
  const { t } = useTranslation();
  const playlistQueue = useStoreState((state) => state.playback.playlistQueue);
  const playedPlaylistQueue = useStoreState(
    (state) => state.playback.playedPlaylistQueue
  );

  const currentlyPlaying = useStoreState(
    (state) => state.playback.currentlyPlaying
  );

  const currentPlaylist = useStoreState((s) => s.playback.currentPlaylist);

  const playlistTotalQueue = useMemo(() => {
    return [...playlistQueue, ...playedPlaylistQueue];
  }, [playedPlaylistQueue, playlistQueue]);

  const queue = useStoreState((state) => state.playback.queue);

  // const clearAll = useStoreActions((actions) => actions.playback.clearAll);
  const clearQueue = useStoreActions((actions) => actions.playback._queueClear);

  const clearPlaylist = useStoreActions(
    (actions) => actions.playback.clearPlaylist
  );

  const next = useStoreActions((actions) => actions.playback.next);
  const formatPlaylist = useFormatPlaylist();
  const { currentTitle, urlLinkToPlaylist } = useMemo(
    () => ({
      currentTitle: currentPlaylist && formatPlaylist("title", currentPlaylist),
      urlLinkToPlaylist:
        currentPlaylist && formatPlaylist("link", currentPlaylist),
    }),
    [currentPlaylist, formatPlaylist]
  );
  const responsiveNowPlaying = useResponseSongRow();

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Queue")} - Musicdex</title>
      </Helmet>
      <SongContextMenu menuId={QUEUE_MENU_ID} />
      <div className="bgOver"></div>
      <ContainerInlay>
        <Heading size="lg">{t("Now Playing")}</Heading>
        {currentlyPlaying.song ? (
          <SongRow
            index={0}
            style={{ borderTop: "none" }}
            data={{
              songList: [currentlyPlaying.song],
              menuId: DEFAULT_MENU_ID,
              rowProps: {
                showArtwork: true,
                hideCol: responsiveNowPlaying,
              },
            }}
          />
        ) : (
          <Text fontSize="lg" opacity={0.66}>
            {t("Nothing to play...")}
          </Text>
        )}

        {queue.length > 0 && (
          <React.Fragment>
            <Flex mt={4} alignItems="center">
              <Text fontSize={["md", "lg"]}>
                <Text opacity={0.66} as={"span"}>
                  {t("Queue")}
                </Text>
              </Text>
              <Spacer />
              <IconButton
                aria-label="clear playlist"
                icon={<FiTrash />}
                colorScheme="red"
                variant="ghost"
                onClick={() => clearQueue()}
              ></IconButton>
            </Flex>
            <Suspense fallback={<div>{t("Loading...")}</div>}>
              <SongTable
                songs={queue}
                menuId={QUEUE_MENU_ID}
                rowProps={{
                  songClicked: (e, song, idx) =>
                    next({ count: idx + 1, userSkipped: true }),
                }}
                limit={10}
              />
            </Suspense>
          </React.Fragment>
        )}
        {currentPlaylist && (
          <React.Fragment>
            <Flex mt={4} alignItems="center">
              <Text fontSize={["md", "lg"]} noOfLines={1}>
                <Text opacity={0.66} as={"span"}>
                  {t("Playlist")}:
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
                aria-label="clear playlist"
                icon={<FiTrash />}
                colorScheme="red"
                variant="ghost"
                onClick={() => clearPlaylist()}
              ></IconButton>
            </Flex>
            <Suspense fallback={<div>{t("Loading...")}</div>}>
              <SongTable
                songs={playlistTotalQueue}
                rowProps={{
                  songClicked: (e, song, idx) =>
                    next({ count: queue.length + idx + 1, userSkipped: true }),
                  indexShift: queue.length,
                }}
                limit={10}
              />
            </Suspense>
          </React.Fragment>
        )}
      </ContainerInlay>
    </PageContainer>
  );
});
