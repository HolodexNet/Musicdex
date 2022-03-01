import { VStack, Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useNamePicker from "../../../modules/common/useNamePicker";

export const TitleGrid = ({
  song, //: { original, channel },
  onTitleClick,
  flipNames,
}: {
  song: Song;
  onTitleClick: (e: any) => void;
  flipNames?: boolean;
  // row: { original: Song; channel: string };
}) => {
  const tn = useNamePicker();

  return (
    <VStack alignItems="start" spacing={0}>
      <Box
        noOfLines={1}
        title={song.name}
        onClick={onTitleClick}
        cursor="pointer"
      >
        {song.name}
      </Box>
      <Text
        opacity={0.66}
        fontWeight={300}
        fontSize="sm"
        as={Link}
        to={flipNames ? "" : "/channel/" + song.channel_id}
        onClick={(e) => {
          e.stopPropagation();
        }}
        _hover={{ opacity: 0.9 }}
      >
        {flipNames
          ? song.original_artist
          : tn(song.channel?.english_name, song.channel?.name)}
      </Text>
    </VStack>
  );
};
