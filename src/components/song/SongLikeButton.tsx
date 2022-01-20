import { IconButton, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { useQueryClient } from "react-query";
import {
  useSongLikeUpdater,
  useSongLikeBulkCheck,
} from "../../modules/services/like.service";

export function SongLikeButton({ song }: { song: Song }) {
  const {
    mutate: updateLike,
    isSuccess,
    isError,
    isLoading,
  } = useSongLikeUpdater();

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
  const { data, isLoading: isLoadingStatus } = useSongLikeBulkCheck(song.id);

  function toggleLike() {
    updateLike({
      song_id: song.id,
      action: data ? "delete" : "add",
    });
  }

  // console.log(data);
  return (
    <IconButton
      // size="sm"
      width="20px"
      // padding="4px"
      margin={-2}
      icon={
        isLoading || isLoadingStatus ? (
          <FiLoader />
        ) : data ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )
      }
      aria-label="Like Song"
      onClick={toggleLike}
      colorScheme={"brand"}
      variant="ghost"
      opacity={data ? 1 : 0.3}
      // mr={2}
      // ml={-1}
    ></IconButton>
  );
}
