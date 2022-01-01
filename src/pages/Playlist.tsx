import { Box, useColorModeValue, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Suspense, useMemo, useState } from "react";
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
import React from "react";
import { QueryStatus } from "../components/common/QueryStatus";
import { ContainerInlay } from "../components/layout/ContainerInlay";

export function Playlist() {
  let params = useParams();
  let playlistId = params.playlistId!;
  let { user, isLoggedIn } = useClient();

  const { data: playlist, ...status } = usePlaylist(playlistId);

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

  // Editing:
  const [newSongIds, setNewSongIds] = useState<string[] | null>(null);

  const toast = useToast();

  const finishSongEditing = async () => {
    if (newSongIds !== null) {
      const newWritable: Partial<WriteablePlaylist> = {
        ...playlist,
        content: newSongIds,
      };
      writeNewPlaylist(newWritable).then(
        (_) => {
          //success:
          toast({ variant: "subtle", status: "success", title: "Saved" });
          setEditMode(false);
        },
        (err) => {
          toast({
            variant: "solid",
            status: "error",
            title: "Failed to Save",
            description: err,
          });
          setEditMode(false);
        }
      );
    }
  };

  const SongEditableTable = React.lazy(
    () => import("../components/data/SongTableEditable")
  );

  if (!playlist)
    return (
      <QueryStatus queryStatus={status} height="100%" justifyContent="center" />
    );

  return (
    <PageContainer>
      <BGImgContainer>
        <BGImg banner_url={banner || ""}></BGImg>
      </BGImgContainer>
      <ContainerInlay mt="12">
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
          count={
            (editMode
              ? newSongIds?.length ?? playlist?.content?.length
              : playlist?.content?.length) || ""
          }
        />
        <PlaylistButtonArray
          playlist={playlist}
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
          onFinishEditClick={finishSongEditing}
        />
        <Box pt="4">
          {playlist.content &&
            (editMode ? (
              <Suspense fallback={<div>Loading...</div>}>
                <SongEditableTable
                  songs={playlist.content}
                  songsEdited={setNewSongIds}
                />
              </Suspense>
            ) : (
              <SongTable songs={playlist.content} />
            ))}
        </Box>
      </ContainerInlay>
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
