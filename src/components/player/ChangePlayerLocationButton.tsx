import {
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import React from "react";
import { FiEyeOff, FiMaximize, FiSidebar } from "react-icons/fi";
import { MdPictureInPicture, MdPictureInPictureAlt } from "react-icons/md";
import { useStoreActions, useStoreState } from "../../store";
import { SelectedPosition } from "../../store/settings";

const LocationIcons: Record<string, JSX.Element> = {
  "hover-top": <MdPictureInPicture />,
  "hover-bottom": <MdPictureInPictureAlt />,
  background: <FiMaximize />,
  sidebar: <FiSidebar />,
  hidden: <FiEyeOff />,
};

function _ChangePlayerLocationButton({ size }: { size?: string }) {
  const pos = useStoreState((store) => store.settings.selectedPosition);
  const setPos = useStoreActions((store) => store.settings.setSelectedPosition);

  return (
    <Popover placement="top">
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton
              aria-label="Expand"
              icon={LocationIcons[pos]}
              variant="ghost"
              size={size}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent width="-webkit-fit-content">
              <PopoverArrow />
              <PopoverBody>
                <HStack spacing={2}>
                  {Object.keys(LocationIcons).map((x: any) => {
                    return (
                      <IconButton
                        key={`yt-player-loc-${x}`}
                        aria-label="Expand"
                        icon={LocationIcons[x as SelectedPosition]}
                        variant="ghost"
                        size={size}
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
          </Portal>
        </>
      )}
    </Popover>
  );
}

export const ChangePlayerLocationButton = React.memo(
  _ChangePlayerLocationButton
);
