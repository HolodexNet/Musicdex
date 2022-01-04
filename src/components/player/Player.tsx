import { useDisclosure } from "@chakra-ui/react";
import { Fragment } from "react";
import { PlayerBar } from "./PlayerBar";
import { PlayerOverlay } from "./PlayerOverlay";

export function Player({ player }: { player: any }) {
  const {
    isOpen: isExpanded,
    onToggle: toggleExpanded,
    onClose: toggleClose,
  } = useDisclosure();

  return (
    <Fragment>
      <PlayerBar
        player={player}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
      />
      <PlayerOverlay isExpanded={isExpanded} close={toggleClose} />
    </Fragment>
  );
}
