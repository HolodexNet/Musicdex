import { IconButton, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { useSongLikeUpdater } from "../../modules/services/like.service";

export function SongLikeButton({ song }: { song: Song }) {
  const {
    mutate: updateLike,
    isSuccess,
    isError,
    isLoading,
  } = useSongLikeUpdater();

  const liked = song.liked;
  const toast = useToast();

  useEffect(() => {
    if (!isSuccess && !isError) return;
    toast({
      title: isSuccess ? "Changed like status" : "Failed to change like status",
      status: isSuccess ? "success" : "error",
      duration: 1000,
      isClosable: true,
    });
  }, [isSuccess, isError, toast]);

  function toggleLike() {
    updateLike({
      song_id: song.id,
      action: liked ? "delete" : "add",
    });
  }

  return (
    <IconButton
      // size="sm"
      width="20px"
      // padding="4px"
      margin={-2}
      icon={isLoading ? <FiLoader /> : liked ? <FaHeart /> : <FaRegHeart />}
      aria-label="Like Song"
      onClick={toggleLike}
      colorScheme={"brand"}
      variant="ghost"
      opacity={liked ? 1 : 0.3}
      // mr={2}
      // ml={-1}
    ></IconButton>
  );
}
