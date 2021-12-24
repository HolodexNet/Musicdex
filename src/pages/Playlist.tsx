import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { FormEventHandler, useState } from "react";
import { FiEdit3, FiMoreHorizontal, FiPlay } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { SongTable } from "../components/data/SongTable";
import { PlaylistMoreControlsMenu } from "../components/playlist/PlaylistMoreControls";
import { useClient } from "../modules/client";
import { usePlaylist } from "../modules/services/playlist.service";
import { useStoreActions } from "../store";

export function Playlist() {
  let { playlistId }: { playlistId: string } = useParams();
  let { user, isLoggedIn } = useClient();

  const {
    data: playlist,
    isLoading,
    isFetching,
    error,
    isError,
  } = usePlaylist(playlistId);

  const [editMode, setEditMode] = useState(false);

  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);
  const setPlaylist = useStoreActions(
    (actions) => actions.playback.setPlaylist
  );

  function handleClick(song: Song) {
    queueSongs({ songs: [song], immediatelyPlay: true });
  }

  console.log(playlist, user?.id);
  const bgColor = useColorModeValue("bgAlpha.50", "bgAlpha.900");

  if (!playlist) return <div> loading </div>;
  return (
    <Container
      maxW={{ lg: "7xl" }}
      alignContent="stretch"
      p={{ base: 0, xl: 4 }}
    >
      <BGImgContainer>
        <BGImg banner_url="https://yt3.ggpht.com/jPLOvKqsP7v3Pv6VIWkfZ0Z6UrAf0JywK_i6XvYoKem-MaZ0HLGeKeklL_oamTdwIviG1wKbuQ=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"></BGImg>
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
          title="Test Title"
          description="Test Description"
          canEdit={isLoggedIn && playlist.owner == user?.id}
          editMode={false}
        />
        <Buttons
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
          {playlist.content && <SongTable songs={playlist.content} />}
        </Box>
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
`;

type ClickEventHandler = React.MouseEventHandler<HTMLButtonElement>;

type PlaylistHeadingProps = {
  title: string;
  description: string;
  canEdit: boolean;
  editMode: boolean;
  setTitle?: (text: string) => {};
  setDescription?: (text: string) => {};
};

function PlaylistHeading({
  title,
  description,
  canEdit,
  editMode,
  setTitle,
  setDescription,
}: PlaylistHeadingProps) {
  const colors = useColorModeValue("gray.700", "gray.400");

  const [editTitle, setEditTitle] = useState(() => canEdit && editMode);
  const [editDescription, setEditDescription] = useState(
    () => canEdit && editMode
  );

  const submitHandlerTitle: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setEditTitle(false);
    if (setTitle) setTitle((e.target as any)[0].value as string);
  };
  const submitHandlerDesc: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setEditDescription(false);
    if (setDescription) setDescription((e.target as any)[0].value as string);
  };

  return (
    <Box as={"header"} mb="2" position="relative">
      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
      >
        {editTitle ? (
          <form onSubmit={submitHandlerTitle}>
            <Input
              placeholder="Playlist Title"
              size="lg"
              autoFocus
              value={title}
              enterKeyHint="done"
            />
          </form>
        ) : (
          title
        )}
        <IconButton
          display={!editTitle && canEdit ? "inline-block" : "none"}
          onClick={() => {
            setEditTitle(true);
          }}
          aria-label="edit title"
          variant="link"
          icon={<FiEdit3 />}
        ></IconButton>
      </Heading>
      <Text color={colors} fontWeight={300} fontSize={"2xl"}>
        {editDescription ? (
          <form onSubmit={submitHandlerDesc}>
            <Input
              placeholder="Playlist Description"
              value={description}
              autoFocus
              enterKeyHint="done"
            />
          </form>
        ) : (
          description
        )}
        <IconButton
          display={!editDescription && canEdit ? "inline-block" : "none"}
          onClick={() => {
            setEditDescription(true);
          }}
          aria-label="edit title"
          variant="link"
          icon={<FiEdit3 />}
        ></IconButton>
      </Text>
    </Box>
  );
}

function Buttons({
  onPlayClick,
  onAddQueueClick,
  onEditClick,
  onFinishEditClick,
  editMode,
}: {
  onPlayClick: ClickEventHandler;
  onAddQueueClick: ClickEventHandler;
  onEditClick?: ClickEventHandler;
  onFinishEditClick?: ClickEventHandler;
  editMode: boolean;
}): JSX.Element {
  return (
    <HStack spacing={4}>
      <Button
        aria-label="play"
        leftIcon={<FiPlay />}
        size="md"
        colorScheme="n2"
        onClick={onPlayClick}
      >
        Play
      </Button>
      <Button
        variant="ghost"
        aria-label="add to queue"
        size="md"
        colorScheme="n2"
        onClick={onAddQueueClick}
      >
        Add to Queue
      </Button>
      <Button
        display={!editMode ? "block" : "none"}
        variant="ghost"
        aria-label="edit"
        size="md"
        colorScheme="n2"
        onClick={(e) => {
          onEditClick && onEditClick(e);
        }}
      >
        Edit
      </Button>
      <Button
        display={editMode ? "block" : "none"}
        variant="ghost"
        aria-label="edit"
        size="md"
        colorScheme="green"
        onClick={(e) => {
          onFinishEditClick && onFinishEditClick(e);
        }}
      >
        Done Editing
      </Button>
      <PlaylistMoreControlsMenu></PlaylistMoreControlsMenu>
    </HStack>
  );
}
