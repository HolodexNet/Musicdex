import {
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CgInpicture } from "react-icons/cg";
import { useStoreActions, useStoreState } from "../../store";
import { PlayerPosition } from "../../store/player";
import { FiMaximize, FiSidebar } from "react-icons/fi";
import { MdPictureInPicture, MdPictureInPictureAlt } from "react-icons/md";

const LocationIcons: Record<PlayerPosition, JSX.Element> = {
  "hover-top": <MdPictureInPicture />,
  "hover-bottom": <MdPictureInPictureAlt />,
  background: <FiMaximize />,
  sidebar: <FiSidebar />,
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
                {Object.keys(LocationIcons).map((x: any) => {
                  return (
                    <IconButton
                      aria-label="Expand"
                      icon={LocationIcons[x as PlayerPosition]}
                      variant="ghost"
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
