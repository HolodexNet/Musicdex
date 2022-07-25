import { IconButton, IconButtonProps, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  useSongLikeUpdater,
  useSongLikeBulkCheck,
} from "../../modules/services/like.service";

interface SongLikeButtonProps extends Omit<IconButtonProps, "aria-label"> {
  song: Song;
}

export function SongLikeButton({ song, ...rest }: SongLikeButtonProps) {
  const toast = useToast();
  const { t } = useTranslation();
  const {
    mutate: updateLike,
    isLoading,
    isSuccess,
    isError,
  } = useSongLikeUpdater();
  const { data: isLiked } = useSongLikeBulkCheck(song.id);

  useEffect(() => {
    if (isLoading || (!isSuccess && !isError)) return; // Check if in progress
    if (isSuccess) return; // Do not show toast on success

    const title = !isLiked
      ? t("Added to liked songs")
      : t("Removed from liked songs");
    toast({
      title: isSuccess ? title : t("An error has occurred"),
      status: isSuccess ? "success" : "error",
      duration: isSuccess ? 1500 : 5000,
      position: "top-right",
      isClosable: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess, isError, toast]);

  function toggleLike() {
    updateLike({
      song_id: song.id,
      action: isLiked ? "delete" : "add",
    });
  }

  return (
    <IconButton
      width="20px"
      margin={-2}
      icon={isLiked ? <FaHeart /> : <FaRegHeart />}
      onClick={toggleLike}
      colorScheme={"brand"}
      variant="ghost"
      opacity={isLiked ? 1 : 0.3}
      aria-label="Like Song"
      {...rest}
    ></IconButton>
  );
}
