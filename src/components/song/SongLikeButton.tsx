import { IconButton, IconButtonProps, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const {
    mutate: updateLike,
    isSuccess,
    isError,
    isLoading,
  } = useSongLikeUpdater();

  const toast = useToast();
  const { data, isLoading: isLoadingStatus } = useSongLikeBulkCheck(song.id);

  useEffect(() => {
    if (!isSuccess && !isError) return;
    const title = !data
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
  }, [isSuccess, isError, toast]);

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
