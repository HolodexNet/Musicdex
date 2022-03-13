import { Box, HStack, StackProps, Text, Link } from "@chakra-ui/react";
import React from "react";
import { useContextMenu } from "react-contexify";
import { Link as NavLink } from "react-router-dom";
import useNamePicker from "../../../modules/common/useNamePicker";
import { DEFAULT_MENU_ID } from "../../common/CommonContext";
import { SongArtwork } from "../../song/SongArtwork";
import { SongLikeButton } from "../../song/SongLikeButton";

interface SongInfoProps extends StackProps {
  song: Song;
  fullPlayer?: boolean;
}
export const SongInfo = React.memo(
  ({ song, fullPlayer = false, ...rest }: SongInfoProps) => {
    const { show } = useContextMenu({ id: DEFAULT_MENU_ID });
    const tn = useNamePicker();

    return (
      <HStack onContextMenu={(e) => show(e, { props: song })} {...rest}>
        <SongArtwork song={song} size={fullPlayer ? 70 : 50} resizeHint={70} />

        <Box>
          <Link as={NavLink} to={`/song/${song.id}`}>
            <Text
              fontWeight={fullPlayer ? 600 : 500}
              noOfLines={fullPlayer ? 2 : 1}
              fontSize={fullPlayer ? "lg" : "md"}
            >
              {song.name}
            </Text>
          </Link>
          <Link as={NavLink} to={`/channel/${song.channel_id}`}>
            <Text
              noOfLines={fullPlayer ? 2 : 1}
              opacity={0.66}
              fontSize={fullPlayer ? "lg" : "md"}
            >
              {tn(song.channel.english_name, song.channel.name)}
            </Text>
          </Link>
        </Box>
        <SongLikeButton
          song={song}
          visibility={
            fullPlayer ? "visible" : ["hidden", null, null, "visible"]
          }
          fontSize={fullPlayer ? "xl" : "md"}
        />
      </HStack>
    );
  }
);
