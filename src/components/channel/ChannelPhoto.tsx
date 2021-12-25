import { Link, Image } from "@chakra-ui/react";
import { getChannelPhoto } from "../../modules/channel/utils";

export function ChannelPhoto({
  channelId,
  rounded = true,
  size = 50,
}: {
  channelId: string;
  rounded?: boolean;
  size?: number;
}) {
  return (
    <Link>
      <Image
        width={`${size}px`}
        height={`${size}px`}
        src={getChannelPhoto(channelId, size)}
        alt={channelId}
        borderRadius={rounded ? "50%" : "0"}
        loading="lazy"
      />
    </Link>
  );
}
