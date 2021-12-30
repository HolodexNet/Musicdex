import {
  Button,
  HStack,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiPlay, FiShare, FiShare2 } from "react-icons/fi";
import { useClipboardWithToast } from "../../modules/common/clipboard";
import { PlaylistMoreControlsMenu } from "./PlaylistMoreControls";

type ClickEventHandler = React.MouseEventHandler<HTMLButtonElement>;

export function PlaylistButtonArray({
  onPlayClick,
  onAddQueueClick,
  onEditClick,
  onFinishEditClick,
  editMode,
  canEdit,
  playlist,
}: {
  onPlayClick: ClickEventHandler;
  onAddQueueClick: ClickEventHandler;
  onEditClick?: ClickEventHandler;
  onFinishEditClick?: ClickEventHandler;
  editMode: boolean;
  canEdit: boolean;
  playlist: PlaylistFull;
}): JSX.Element {
  // useColorModeValue('bg.400')
  const clip = useClipboardWithToast();
  return (
    <HStack spacing={4} flexShrink={1} flexWrap="wrap">
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
        display={!editMode && canEdit ? "block" : "none"}
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
        display={editMode && canEdit ? "block" : "none"}
        variant="ghost"
        aria-label="edit"
        size="md"
        colorScheme="green"
        onClick={(e) => {
          onFinishEditClick && onFinishEditClick(e);
        }}
      >
        Save Changes
      </Button>
      <Button
        variant="ghost"
        aria-label="share link"
        size="md"
        onClick={() => clip(window.location.toString(), false)}
        colorScheme="n2"
      >
        <FiShare2 />
      </Button>
      <PlaylistMoreControlsMenu
        playlist={playlist}
        canEdit={canEdit}
      ></PlaylistMoreControlsMenu>
    </HStack>
  );
}
