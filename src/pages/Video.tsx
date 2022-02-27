import { Box, Text, Button } from "@chakra-ui/react";
import axios from "axios";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { FiYoutube } from "react-icons/fi";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import useNamePicker from "../modules/common/useNamePicker";
import { DEFAULT_FETCH_CONFIG } from "../modules/services/defaults";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";

export default function Video() {
  // const history = useStoreState((store) => store.playback.history);
  let params = useParams();
  const { t } = useTranslation();
  let videoId = params.id!;

  const { data: playlist, ...status } = usePlaylist(`:video[id=${videoId}]`);

  const { data: video, ...videoStatus } = useQuery(
    ["video", videoId],
    async (q) => {
      return (await axios.get("/api/v2/videos/" + q.queryKey[1])).data;
    },
    {
      ...DEFAULT_FETCH_CONFIG /* 10 mins */,
      cacheTime: 600000,
      staleTime: 600000,
    }
  );

  const tn = useNamePicker();

  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  if (videoStatus.isLoading) return <QueryStatus queryStatus={status} />;

  return (
    <PageContainer>
      <ContainerInlay>
        <PlaylistHeading
          title={video.title}
          description={
            "Sang by " +
            tn(video.channel.english_name, video.channel.name) +
            " " +
            t("NO_TL.relativeDate", { date: new Date(video.available_at) })
          }
          canEdit={false}
          editMode={false}
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
          >
            <Button
              variant="ghost"
              aria-label="open-on-youtube"
              size="md"
              colorScheme="gray"
              title="Open on Youtube"
              onClick={() => {
                window.open("https://youtu.be/" + video.id);
              }}
            >
              <FiYoutube />
            </Button>
          </PlaylistButtonArray>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          {playlist?.content && <SongTable songs={playlist.content} />}{" "}
        </Suspense>
        {!playlist && status.isError && (
          <Box>
            <Text>Stream is not yet tagged with any songs.</Text>
            <Button
              variant="link"
              colorScheme={"n2"}
              as="a"
              href={`https://holodex.net/edit/video/${video.id}/music`}
              target="_blank"
            >
              Help us tag it on Holodex
            </Button>
          </Box>
        )}
      </ContainerInlay>
    </PageContainer>
  );
}
