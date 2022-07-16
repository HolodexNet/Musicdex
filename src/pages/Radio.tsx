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
  useRadio,
} from "../modules/services/playlist.service";
import { useStoreActions } from "../store";
import { useSongQueuer } from "../utils/SongQueuerHook";
const SongEditableTable = React.lazy(
  () => import("../components/data/SongTableEditable")
);

export default function Radio() {
  const { t } = useTranslation();
  let params = useParams();
  let radioId = params.radioId!;
  // let { user, isLoggedIn } = useClient();

  const { data: playlist, ...status } = useRadio(radioId);

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
        <title>{title || t("Untitled Playlist")} - Musicdex Radio</title>
      </Helmet>
      <BGImgContainer height="200px">
        <BGImg banner_url={banner || ""} height="200px"></BGImg>
      </BGImgContainer>
      <ContainerInlay mt="12">
        <PlaylistHeading
          playlist={playlist}
          title={title || t("Untitled Playlist")}
          description={description || ""}
          count={0}
        />
        <PlaylistButtonArray
          mb={2}
          playlist={playlist}
          hideElement={["addToQueue", "delete", "edit"]}
          canEdit={false}
          editMode={false}
          onPlayClick={() => {
            setPlaylist({ playlist });
          }}
        />

        {playlist.content && <SongTable playlist={playlist} virtualized />}
      </ContainerInlay>
    </PageContainer>
  );
}
