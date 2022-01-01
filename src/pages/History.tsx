import { Box, Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { Fragment } from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClient } from "../modules/client";
import { useHistory } from "../modules/services/history.service";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { formatPlaylistID } from "../utils/SGPFunctions";

export function History() {
  // const history = useStoreState((store) => store.playback.history);
  const { isLoggedIn, user } = useClient();
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  // const {description, }
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
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
      </Fragment>
    );
  }

  return (
    <PageContainer>
      <Box
        bgColor={bgColor}
        position="relative"
        mt="12"
        p={{ base: 2, xl: 4 }}
        borderRadius={5}
      >
        {isLoggedIn ? <Content /> : <div>Please login</div>}
      </Box>
    </PageContainer>
  );
}
