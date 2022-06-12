import { Box, Center, Code, Heading, useToast, VStack } from "@chakra-ui/react";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { BGImg, BGImgContainer } from "../components/layout/BGImgContainer";
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
import { useKeyControl } from "../utils/HotkeyHook";
import { useSongQueuer } from "../utils/SongQueuerHook";
const PlaylistHeadingEditor = React.lazy(
  () => import("../components/playlist/PlaylistHeadingEditor")
);
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

  useKeyControl(
    {
      actions: ["playPlaylist"],
      playlist: playlist,
    },
    [playlist]
  );

  // const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  // Editing:
  const [newTitle, setNewTitle] = useState<string | undefined>();
  const [newDescription, setNewDescription] = useState<string | undefined>();
  const [newSongIds, setNewSongIds] = useState<string[] | undefined>();

  useEffect(() => {
    if (!editMode) {
      setNewTitle(undefined);
      setNewDescription(undefined);
      setNewSongIds(undefined);
    }
  }, [editMode]);

  const toast = useToast();

  const finishSongEditing = useCallback(
    async (songIds?: string[], title?: string, desc?: string) => {
      if (songIds !== undefined || title !== undefined || desc !== undefined) {
        const newWritable: Partial<WriteablePlaylist> = {
          ...playlist,
          content: songIds,
          title: title !== undefined ? title : playlist?.title,
          description: desc !== undefined ? desc : playlist?.description,
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
      <Helmet>
        <title>{title || t("Untitled Playlist")} - Musicdex</title>
      </Helmet>
      <BGImgContainer height="200px">
        <BGImg banner_url={banner || ""} height="200px"></BGImg>
      </BGImgContainer>
      <ContainerInlay mt="12">
        {editMode ? (
          <Suspense fallback={<div>{t("Loading...")}</div>}>
            <PlaylistHeadingEditor
              title={title || t("Untitled Playlist")}
              description={description || ""}
              setDescription={(text) => {
                setNewDescription(text);
              }}
              setTitle={(text) => {
                setNewTitle(text);
              }}
              count={newSongIds?.length ?? (playlist?.content?.length || 0)}
              totalLengthSecs={playlist.content?.reduce(
                (a, c) => a + c.end - c.start,
                0
              )}
            />
          </Suspense>
        ) : (
          <PlaylistHeading
            title={title || t("Untitled Playlist")}
            description={description || ""}
            count={playlist?.content?.length ?? 0}
            totalLengthSecs={playlist.content?.reduce(
              (a, c) => a + c.end - c.start,
              0
            )}
          />
        )}
        <PlaylistButtonArray
          mb={2}
          playlist={playlist}
          canEdit={isLoggedIn && playlist.owner === user?.id}
          canStar={isLoggedIn && playlist.owner !== user?.id}
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
          onFinishEditClick={() =>
            finishSongEditing(newSongIds, newTitle, newDescription)
          }
          onAbortEditClick={() => setEditMode(false)}
        />
        {playlist.content &&
          (editMode ? (
            <Suspense fallback={<div>{t("Loading...")}</div>}>
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
