import { IconButton, HStack, Tooltip, StackProps } from "@chakra-ui/react";
import React from "react";
import { FiMusic, FiUser, FiFilm } from "react-icons/fi";
import { Link as NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SongLinkProps extends StackProps {
  song: Song;
}

export const SongLink = React.memo(({ song, ...rest }: SongLinkProps) => {
  const { t } = useTranslation();
  const iconSize: number = 24;

  return (
    <HStack spacing={4} {...rest}>
      <Tooltip label={t("Go To Song Page")} placement="top">
        <IconButton
          size="lg"
          w="100%"
          as={NavLink}
          to={`/song/${song.id}`}
          aria-label={t("Go To Song Page")}
          icon={<FiMusic size={iconSize} />}
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label={t("Go To Video Page")} placement="top">
        <IconButton
          size="lg"
          w="100%"
          as={NavLink}
          to={`/video/${song.video_id}`}
          aria-label={t("Go To Video Page")}
          icon={<FiFilm size={iconSize} />}
          variant="ghost"
        />
      </Tooltip>
      <Tooltip label={t("Go To Channel Page")} placement="top">
        <IconButton
          size="lg"
          w="100%"
          as={NavLink}
          to={`/channel/${song.channel_id}`}
          aria-label={t("Go To Channel Page")}
          icon={<FiUser size={iconSize} />}
          variant="ghost"
        />
      </Tooltip>
    </HStack>
  );
});
