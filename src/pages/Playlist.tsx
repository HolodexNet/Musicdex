import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { FiPlay } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { SongTable } from "../components/data/SongTable";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";

export function Playlist() {
  let { playlistId }: { playlistId: string } = useParams();
  console.log("rendering...");
  console.log(playlistId);
  const {
    data: playlist,
    isLoading,
    isFetching,
    error,
    isError,
  } = usePlaylist(playlistId);

  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  function handleClick(song: Song) {
    queueSongs({ songs: [song], immediatelyPlay: true });
  }

  const colors = useColorModeValue("gray.700", "gray.400");
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");
  if (!playlist) return <div> loading </div>;
  return (
    <Container maxW={"7xl"} alignContent="stretch">
      <BGImgContainer>
        <BGImg banner_url="https://yt3.ggpht.com/jPLOvKqsP7v3Pv6VIWkfZ0Z6UrAf0JywK_i6XvYoKem-MaZ0HLGeKeklL_oamTdwIviG1wKbuQ=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"></BGImg>
      </BGImgContainer>
      {/* <SimpleGrid
        columns={{ base: 1 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 10, md: 14 }}> */}

      {/* <VStack> */}
      {/* <HStack justifyContent="space-between"> */}
      <Box bgColor={bgColor} position="relative" mt="12" p="4" borderRadius={5}>
        <Box as={"header"} mb="2" position="relative">
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
          >
            Daily Mix: Hakos Baelz
          </Heading>
          <Text color={colors} fontWeight={300} fontSize={"2xl"}>
            Provided by Holodex
          </Text>
        </Box>
        <Box>
          <Button
            aria-label="play"
            leftIcon={<FiPlay />}
            size="md"
            colorScheme="red"
          >
            Play
          </Button>
          <Button
            variant="ghost"
            aria-label="add to queue"
            size="md"
            color="red.200"
          >
            Add to Queue
          </Button>
        </Box>
        {/* </HStack> */}
        <Box pt="4">
          {playlist.content && <SongTable songs={playlist.content} />}
        </Box>
        {/* </VStack> */}
        {/* </SimpleGrid> */}
      </Box>
    </Container>
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
    rgba(64, 0, 126, 0.63) 48%,
    rgba(64, 0, 126, 0.58) 74%,
    rgba(0, 255, 160, 0) 100%
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
`;
