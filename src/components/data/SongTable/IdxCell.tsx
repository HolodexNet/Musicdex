import { FaPlay } from "react-icons/fa";
import { useStoreState } from "../../../store";
import { MotionBox } from "../../common/MotionBox";
import { NowPlayingIcon } from "../../common/NowPlayingIcon";
import { Text } from "@chakra-ui/react";

export const IdxGrid = ({
  id,
  songId,
  active,
  onPlayClick,
}: {
  id: number;
  songId: string;
  active: boolean;
  onPlayClick: (e: any) => void;
}) => {
  const currentId = useStoreState(
    (state) => state.playback.currentlyPlaying?.song?.id
  );
  switch (true) {
    case songId === currentId:
      return (
        <NowPlayingIcon style={{ color: "var(--chakra-colors-n2-400)" }} />
      );
    case active:
      return (
        <MotionBox
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          color="brand.400"
          _hover={{ color: "brand.200" }}
          onClick={onPlayClick}
          cursor="pointer"
          marginLeft="1px"
        >
          <FaPlay />
        </MotionBox>
      );
    default:
      return (
        <Text as={"span"} opacity={0.8}>
          {id + 1}
        </Text>
      );
  }
};
