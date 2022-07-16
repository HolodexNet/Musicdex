import { Box, Text, Button, IconButton, VStack } from "@chakra-ui/react";
import axios from "axios";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { FiTag, FiYoutube, FiExternalLink } from "react-icons/fi";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { LineLogo } from "../components/icons/LineLogo";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import useNamePicker from "../modules/common/useNamePicker";
import { usePlaylistTitleDesc } from "../modules/playlist/useFormatPlaylist";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";

export default function Video() {
  const { t } = useTranslation();
  let params = useParams();
  let videoId = params.id!;
  const { data: playlist, ...status } = usePlaylist(`:video[id=${videoId}]`);
  const { title, description } = usePlaylistTitleDesc(playlist);

  const tn = useNamePicker();

  const queueSongs = useSongQueuer();
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  // if (videoStatus.isLoading) return <QueryStatus queryStatus={status} />;

  return (
    <PageContainer>
      <ContainerInlay>
        <PlaylistHeading
          playlist={playlist}
          title={title || "Video"}
          description={description || ""}
          count={playlist?.content?.length || 0}
          max={0}
          totalLengthSecs={playlist?.content?.reduce(
            (a, c) => a + c.end - c.start,
            0
          )}
        />
        {playlist?.content && (
          <PlaylistButtonArray
            playlist={playlist}
            canEdit={false}
            editMode={false}
            onPlayClick={() => {
              setPlaylist({ playlist });
            }}
            canStar={false}
            onAddQueueClick={() => {
              playlist.content &&
                queueSongs({
                  songs: [...playlist.content],
                  immediatelyPlay: false,
                });
            }}
            mb={2}
          >
            {[
              {
                title: t("Open in YouTube"),
                ariaLabel: "open-on-youtube",
                icon: <FiYoutube />,
                onClick: () => window.open("https://youtu.be/" + videoId),
              },
              {
                title: t("Open in Holodex"),
                ariaLabel: "open-on-holodex",
                icon: <LineLogo />,
                onClick: () =>
                  window.open("https://holodex.net/watch/" + videoId),
              },
            ]}
          </PlaylistButtonArray>
        )}
        <Suspense fallback={<div>{t("Loading...")}</div>}>
          {playlist?.content && <SongTable playlist={playlist} />}{" "}
        </Suspense>
        {!playlist && status.isError && (
          <VStack w="100%" h="100%" justify="center">
            <FiTag size={40} />
            <Text>{t("Stream is not yet tagged with any songs.")}</Text>
            <Button
              variant="link"
              colorScheme={"n2"}
              as="a"
              href={`https://holodex.net/edit/video/${videoId}/music`}
              target="_blank"
              rightIcon={<FiExternalLink />}
            >
              {t("Help us tag it on Holodex")}
            </Button>
          </VStack>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
