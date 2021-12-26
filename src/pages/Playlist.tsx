import { Box, useColorModeValue } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClient } from "../modules/client";
import {
  usePlaylist,
  usePlaylistWriter,
} from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import {
  identifyDescription,
  identifyPlaylistBannerImage,
  identifyTitle,
} from "../utils/PlaylistHelper";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { SongEditableTable } from "../components/data/SongTableEditable";

export function Playlist() {
  let params = useParams();
  let playlistId = params.playlistId!;
  let { user, isLoggedIn } = useClient();

  const {
    data: playlist,
    isLoading,
    isFetching,
    error,
    isError,
  } = usePlaylist(playlistId);

  const { mutateAsync: writeNewPlaylist } = usePlaylistWriter();

  const [editMode, setEditMode] = useState(false);
  const { banner, title, description } = useMemo(() => {
    return (
      (playlist && {
        banner: identifyPlaylistBannerImage(playlist),
        title: identifyTitle(playlist),
        description: identifyDescription(playlist),
      }) ||
      {}
    );
  }, [playlist]);

  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  function handleClick(song: Song) {
    queueSongs({ songs: [song], immediatelyPlay: true });
  }

  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  const writablePlaylist: Partial<WriteablePlaylist> = useMemo(() => {
    let c: Partial<WriteablePlaylist> = {
      ...playlist,
      content: playlist?.content?.map((x) => x.id),
    };
    return c;
  }, [playlist]);

  if (!playlist) return <div> loading </div>;

  return (
    <PageContainer>
      <BGImgContainer>
        <BGImg banner_url={banner || ""}></BGImg>
      </BGImgContainer>
      <Box
        bgColor={bgColor}
        position="relative"
        mt="12"
        p={{ base: 2, xl: 4 }}
        pt={{ base: 4, xl: 8 }}
        borderRadius={5}
      >
        <PlaylistHeading
          title={title || "..."}
          description={description || "..."}
          canEdit={isLoggedIn && playlist.owner == user?.id}
          editMode={false}
          setDescription={(text) => {
            writeNewPlaylist({ ...writablePlaylist, description: text });
          }}
          setTitle={(text) => {
            writeNewPlaylist({ ...writablePlaylist, title: text });
          }}
        />
        <PlaylistButtonArray
          canEdit={isLoggedIn && playlist.owner == user?.id}
          editMode={editMode}
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
          onEditClick={() => {
            setEditMode(true);
          }}
          onFinishEditClick={() => setEditMode(false)}
        />
        <Box pt="4">
          {playlist.content &&
            (editMode ? (
              <SongEditableTable
                songs={playlist.content}
                songsEdited={(ids) => console.log(ids)}
              />
            ) : (
              <SongTable songs={playlist.content} />
            ))}
        </Box>
      </Box>
    </PageContainer>
  );
}

const BGImgContainer = styled.div`
  width: 100%;
  position: absolute;
  z-index: 0;
  left: 0px;
  top: 0px;
  height: 190px;
  mask-image: radial-gradient(
    ellipse farthest-side at 33% 12%,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.63) 48%,
    rgba(0, 0, 0, 0.58) 74%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-size: 150% 132%;
  mask-position: left bottom;
`;

const BGImg = styled.div<{ banner_url: string }>`
  width: 100%;
  position: absolute;
  z-index: 0;
  left: 0px;
  top: 0px;
  height: 190px;
  background: url(${({ banner_url }) => banner_url});
  background-position: center;
  background-size: cover;
`;
