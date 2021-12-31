import { IconButton, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  useLikeSongChecker,
  useSongLikeUpdater,
} from "../../modules/services/like.service";

export function SongLikeButton({
  songId,
  active,
}: {
  songId: string;
  active: boolean;
}) {
  const { data: liked, isSuccess: hasData } = useLikeSongChecker(
    songId,
    active
  );
  // const like = useSongLikeUpdater({ song_id: songId, action: "add" });
  const { mutate: updateLike, isSuccess, isError } = useSongLikeUpdater();
  const toast = useToast();

  useEffect(() => {
    if (!(isSuccess && isError)) return;
    toast({
      title: isSuccess ? "Changed like status" : "Failed to change like status",
      status: isSuccess ? "success" : "error",
      duration: 1000,
      isClosable: true,
    });
  }, [isSuccess, isError, toast]);

  function toggleLike() {
    updateLike({
      song_id: songId,
      action: liked ? "delete" : "add",
    });
  }

  return (
    <IconButton
      size="sm"
      icon={liked ? <FaHeart /> : <FaRegHeart />}
      aria-label="Like Song"
      onClick={toggleLike}
      colorScheme={active ? "brand" : "whiteAlpha"}
      variant="ghost"
      opacity={hasData ? 1 : 0.5}
      mr={2}
      ml={-1}
    ></IconButton>
  );
}
