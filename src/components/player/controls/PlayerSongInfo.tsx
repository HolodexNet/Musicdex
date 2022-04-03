import {
  Box,
  HStack,
  StackProps,
  Text,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useContextMenu } from "react-contexify";
import { Link as NavLink } from "react-router-dom";
import useNamePicker from "../../../modules/common/useNamePicker";
import { DEFAULT_MENU_ID } from "../../song/SongContextMenu";
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
    const isMobile = useBreakpointValue({ base: true, md: false });
    const mobileArtClick: React.MouseEventHandler = useCallback(
      (e) => {
        if (isMobile) return;
        else show(e, { props: song });
      },
      [isMobile, show, song]
    );

    return (
      <HStack onContextMenu={(e) => show(e, { props: song })} {...rest}>
        <SongArtwork
          song={song}
          size={fullPlayer ? 70 : 50}
          resizeHint={70}
          onClick={mobileArtClick}
          _hover={!isMobile ? { transform: "translateY(-1px)" } : {}}
        />

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
