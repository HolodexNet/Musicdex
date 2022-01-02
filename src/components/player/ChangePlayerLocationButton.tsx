import {
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FiEyeOff, FiMaximize, FiSidebar } from "react-icons/fi";
import { MdPictureInPicture, MdPictureInPictureAlt } from "react-icons/md";
import { useStoreActions, useStoreState } from "../../store";
import { PlayerPosition } from "../../store/player";

const LocationIcons: Record<PlayerPosition, JSX.Element> = {
  "hover-top": <MdPictureInPicture />,
  "hover-bottom": <MdPictureInPictureAlt />,
  background: <FiMaximize />,
  sidebar: <FiSidebar />,
  hidden: <FiEyeOff />,
};

export function ChangePlayerLocationButton() {
  const pos = useStoreState((store) => store.player.position);
  const setPos = useStoreActions((store) => store.player.setPosition);

  return (
    <Popover placement="top">
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              aria-label="Expand"
              icon={LocationIcons[pos]}
              variant="ghost"
            />
          </PopoverTrigger>
          <PopoverContent width="-webkit-fit-content">
            <PopoverArrow />
            <PopoverBody>
              <HStack spacing={2}>
                {Object.keys(LocationIcons).map((x: any, index) => {
                  return (
                    <IconButton
                      key={`yt-player-loc-${index}`}
                      aria-label="Expand"
                      icon={LocationIcons[x as PlayerPosition]}
                      variant="ghost"
                      key={x + "_loc_choice"}
                      colorScheme={x === pos ? "brand" : "bgAlpha"}
                      onClick={() => {
                        setPos(x);
                        onClose();
                      }}
                    />
                  );
                })}
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
