import { Avatar, AvatarProps } from "@chakra-ui/react";
import { getChannelPhoto } from "../../modules/channel/utils";
import useNamePicker from "../../modules/common/useNamePicker";

interface ChannelPhotoProps extends AvatarProps {
  channelId?: string;
  channel?: {
    id?: string;
    english_name?: string;
    name: string;
  };
  resizePhoto?: number;
}

export function ChannelPhoto({
  channelId,
  channel,
  resizePhoto,
  ...rest
}: ChannelPhotoProps) {
  const tn = useNamePicker();

  const id = channelId || channel?.id;
  const src = id && getChannelPhoto(id, resizePhoto);
  const name = tn(channel?.english_name, channel?.name);
  return (
    <Avatar src={src} name={name} loading="lazy" bgColor="unset" {...rest} />
  );
}
