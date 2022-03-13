import { IconButton, IconButtonProps, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import {
  useSongLikeUpdater,
  useSongLikeBulkCheck,
} from "../../modules/services/like.service";

export function SongLikeButton({
  song,
  ...rest
}: { song: Song } & Omit<IconButtonProps, "aria-label">) {
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
      duration: isSuccess ? 1500 : 5000,
      position: "top-right",
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
      onClick={toggleLike}
      colorScheme={"brand"}
      variant="ghost"
      opacity={data ? 1 : 0.3}
      aria-label="Like Song"
      {...rest}
    ></IconButton>
  );
}
