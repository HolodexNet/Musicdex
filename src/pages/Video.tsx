import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useHistory } from "../modules/services/history.service";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";

export function Video() {
  // const history = useStoreState((store) => store.playback.history);
  let params = useParams();
  let videoId = params.id!;

  const { data: playlist, ...status } = usePlaylist(`:video[id=${videoId}]`);

  const { data: video, ...videoStatus } = useQuery(
    ["video", videoId],
    async (q) => {
      return (await axios.get("/api/v2/videos/" + q.queryKey[1])).data;
    },
    { cacheTime: 600000 /* 10 mins */ }
  );

  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  // const {description, }
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  // useEffect(() => console.log(playlist), [playlist])

  if (!status.isSuccess) return <QueryStatus queryStatus={status} />;

  if (!videoStatus.isSuccess) return <QueryStatus queryStatus={videoStatus} />;

  return (
    <PageContainer>
      <ContainerInlay>
        <PlaylistHeading
          title={video.title}
          description={
            video.channel.name + ". Streamed on:" + video.available_at
          }
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
          />
        )}
        {playlist?.content && <SongTable songs={playlist.content} />}
      </ContainerInlay>
    </PageContainer>
  );
}
