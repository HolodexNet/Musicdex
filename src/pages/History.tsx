import { Fragment, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClient } from "../modules/client";
import { formatPlaylistID } from "../modules/playlist/useFormatPlaylist";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";

export default function History() {
  const { t } = useTranslation();
  // const history = useStoreState((store) => store.playback.history);
  const { user } = useClient();
  const queueSongs = useSongQueuer();
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  function Content() {
    const { data: playlist, ...status } = usePlaylist(
      formatPlaylistID(":history", {
        user_id: user?.id,
      })
    );
    return (
      <Fragment>
        <PlaylistHeading
          title={t("Recently Played")}
          description={t("Your recently played songs")}
          canEdit={false}
          editMode={false}
          count={playlist?.content?.length || 0}
        />
        {playlist?.content && (
          <PlaylistButtonArray
            playlist={playlist}
            canEdit={false}
            editMode={false}
            onPlayClick={() => {
              setPlaylist({ playlist });
            }}
            onAddQueueClick={() => {
              playlist.content &&
                queueSongs({
                  songs: [...playlist.content],
                  immediatelyPlay: false,
                });
            }}
            mb={2}
          />
        )}
        <Suspense fallback={<div>Loading...</div>}>
          {playlist?.content && <SongTable playlist={playlist} virtualized />}
        </Suspense>
      </Fragment>
    );
  }

  return (
    <PageContainer>
      <Helmet>
        <title>{t("Recently Played")} - Musicdex</title>
      </Helmet>
      <ContainerInlay mt="12">{<Content />}</ContainerInlay>
    </PageContainer>
  );
}
