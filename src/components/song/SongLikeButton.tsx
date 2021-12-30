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
  const { data: liked, isFetched } = useLikeSongChecker(songId, active);
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

  if (!active) {
    return (
      <IconButton
        icon={<FaRegHeart />}
        aria-label="Like Song"
        variant="ghost"
        colorScheme="whiteAlpha"
        // style={{
        //   backgroundClip: 'text',
        //   color:'transparent',
        //   backgroundColor: '#444',
        //   backgroundImage: '-webkit-linear-gradient(45deg, rgba(0, 0, 0, .3) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, .3) 50%, rgba(0, 0, 0, .3) 75%, transparent 75%, transparent)',
        // }}
      ></IconButton>
    );
  }

  function toggleLike() {
    updateLike({
      song_id: songId,
      action: liked ? "delete" : "add",
    });
  }

  return (
    <IconButton
      icon={liked ? <FaHeart /> : <FaRegHeart />}
      aria-label="Like Song"
      onClick={toggleLike}
      variant="ghost"
    ></IconButton>
  );
}
