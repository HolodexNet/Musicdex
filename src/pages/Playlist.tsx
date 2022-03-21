import { Box, Center, Code, Heading, useToast, VStack } from "@chakra-ui/react";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { BGImg, BGImgContainer } from "../components/common/BGImgContainer";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { PlaylistButtonArray } from "../components/playlist/PlaylistButtonArray";
import { PlaylistHeading } from "../components/playlist/PlaylistHeading";
import { useClient } from "../modules/client";
import { useFormatPlaylist } from "../modules/playlist/useFormatPlaylist";
import {
  usePlaylist,
  usePlaylistWriter,
} from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";
const SongEditableTable = React.lazy(
  () => import("../components/data/SongTableEditable")
);

export default function Playlist() {
  const { t } = useTranslation();
  let params = useParams();
  let playlistId = params.playlistId!;
  let { user, isLoggedIn } = useClient();

  const { data: playlist, ...status } = usePlaylist(playlistId);

  const { mutateAsync: writeNewPlaylist } = usePlaylistWriter();

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(false);
  }, [playlistId]);
  const formatPlaylist = useFormatPlaylist();

  const { banner, title, description } = useMemo(() => {
    return (
      (playlist && {
        banner: formatPlaylist("bannerImage", playlist),
        title: formatPlaylist("title", playlist),
        description: formatPlaylist("description", playlist),
      }) ||
      {}
    );
  }, [formatPlaylist, playlist]);

  const queueSongs = useSongQueuer();
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  // const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  const writablePlaylist: Partial<WriteablePlaylist> = useMemo(() => {
    let c: Partial<WriteablePlaylist> = {
      ...playlist,
      content: playlist?.content?.map((x) => x.id),
    };
    return c;
  }, [playlist]);

  // Editing:
  const [newSongIds, setNewSongIds] = useState<string[] | undefined>();

  const toast = useToast();

  const finishSongEditing = useCallback(
    async (songIds?: string[]) => {
      if (songIds !== null) {
        const newWritable: Partial<WriteablePlaylist> = {
          ...playlist,
          content: songIds,
        };
        writeNewPlaylist(newWritable).then(
          (_) => {
            //success:
            toast({
              variant: "subtle",
              status: "success",
              title: t("Saved"),
              duration: 1500,
              position: "top-right",
            });
            setEditMode(false);
          },
          (err) => {
            toast({
              variant: "solid",
              status: "error",
              title: t("Failed to Save"),
              description: err,
              position: "top-right",
              isClosable: true,
            });
            setEditMode(false);
          }
        );
      } else {
        setEditMode(false);
      }
    },
    [playlist, toast, writeNewPlaylist, t]
  );

  if (status.error && (status?.error as any)?.status >= 400) {
    return (
      <Box pt="10vh" px={6}>
        <Center role="alert" my={10}>
          <VStack spacing={4}>
            <Heading>
              {t(
                "You do not have access to this playlist (or it doesn't exist)"
              )}
            </Heading>
            <Code>{(status?.error as Error)?.toString()}</Code>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (!playlist)
    return (
      <QueryStatus queryStatus={status} height="100%" justifyContent="center" />
    );

  return (
    <PageContainer>
      <BGImgContainer height="200px">
        <BGImg banner_url={banner || ""} height="200px"></BGImg>
      </BGImgContainer>
      <ContainerInlay mt="12">
        <PlaylistHeading
          title={title || t("Untitled Playlist")}
          description={description || ""}
          canEdit={isLoggedIn && playlist.owner === user?.id && editMode}
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
              : playlist?.content?.length) || 0
          }
          totalLengthSecs={playlist.content?.reduce(
            (a, c) => a + c.end - c.start,
            0
          )}
        />
        <PlaylistButtonArray
          mb={2}
          playlist={playlist}
          canEdit={isLoggedIn && playlist.owner === user?.id}
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
          onFinishEditClick={() => finishSongEditing(newSongIds)}
        />

        {playlist.content &&
          (editMode ? (
            <Suspense fallback={<div>Loading...</div>}>
              <SongEditableTable
                songs={playlist.content}
                songsEdited={setNewSongIds}
              />
            </Suspense>
          ) : (
            <SongTable playlist={playlist} virtualized />
          ))}
      </ContainerInlay>
    </PageContainer>
  );
}
