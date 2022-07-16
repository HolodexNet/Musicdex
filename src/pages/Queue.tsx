import { Heading } from "@chakra-ui/layout";
import React from "react";
import {
  QUEUE_MENU_ID,
  SongContextMenu,
} from "../components/song/SongContextMenu";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { useStoreActions, useStoreState } from "../store";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { UpcomingSongList } from "../components/data/SongTable/UpcomingSongList";

export const Queue = React.memo(() => {
  const { t } = useTranslation();
  const queue = useStoreState((state) => state.playback.queue);
  const playlistQueue = useStoreState((state) => state.playback.playlistQueue);
  const next = useStoreActions((actions) => actions.playback.next);

  // const currentlyPlaying = useStoreState(
  //   (state) => state.playback.currentlyPlaying
  // );

  // const responsiveNowPlaying = useResponseSongRow();

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Queue")} - Musicdex</title>
      </Helmet>
      <SongContextMenu menuId={QUEUE_MENU_ID} />
      <div className="bgOver"></div>
      <ContainerInlay>
        {/* <Heading my={2} size="md">
          {t("Now Playing")}
        </Heading>
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
          <Text fontSize="md" opacity={0.66}>
            {t("Nothing to play...")}
          </Text>
        )} */}
        <Heading my={2} size="md">
          {t("Upcoming")}
        </Heading>
        <UpcomingSongList
          songs={playlistQueue}
          queue={queue}
          rowProps={{
            songClicked: (e, song, idx) =>
              next({ count: idx + 1, userSkipped: true }),
          }}
          useWindowScroller
        />
      </ContainerInlay>
    </PageContainer>
  );
});
