import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useHistory } from "../modules/services/history.service";
import { useStoreActions } from "../store";

export function History() {
  // const history = useStoreState((store) => store.playback.history);
  const { data: playlist, ...status } = useHistory();
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  // const {description, }
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  return (
    <PageContainer>
      <Box
        bgColor={bgColor}
        position="relative"
        mt="12"
        p={{ base: 2, xl: 4 }}
        borderRadius={5}
      >
        <PlaylistHeading
          title={playlist?.title || "Recently Played"}
          description={playlist?.description || "Your recently played songs"}
          canEdit={false}
          editMode={false}
          count={playlist?.content?.length || ""}
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
      </Box>
    </PageContainer>
  );
}
