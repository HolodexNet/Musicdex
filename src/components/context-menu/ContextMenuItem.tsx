import { Button, Text, Box, HStack, ButtonProps } from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";
import { useStoreActions, useStoreState } from "../../store";

type Props = {
  colorScheme?: string;
  disabled?: boolean;
  onClick?: ({ event, passData }: { event: MouseEvent; passData: any }) => void;
  command?: string;
  icon?: React.ReactElement;
  buttonProps?: ButtonProps;
};

export const ContextMenuItem: React.FC<Props> = ({
  children,
  onClick,
  colorScheme,
  disabled,
  command,
  icon,
  ...buttonProps
}) => {
  const contextMenusState = useStoreState((s) => s.contextMenu.menu);
  const setContextMenusState = useStoreActions((s) => s.contextMenu.setMenu);

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();

        // call the provided click handler with the event and the passthrough data from the trigger
        onClick &&
          onClick({
            event: e as unknown as MouseEvent,
            passData: contextMenusState.passData,
          });

        // TODO: make it more specific
        // close all menus
        setContextMenusState({
          ...contextMenusState,
          menus: contextMenusState.menus.map((m) => ({
            ...m,
            isOpen: false,
          })),
        });
      }}
      borderRadius={0}
      w="full"
      justifyContent="space-between"
      size="sm"
      overflow="hidden"
      textOverflow="ellipsis"
      variant="ghost"
      colorScheme={colorScheme}
      fontWeight="normal"
      disabled={disabled}
      {...buttonProps}
    >
      {/* left */}
      <HStack spacing={2} alignItems="center" w="full" h="full">
        {/* icon */}
        {icon}
        {/* children */}
        <Text>{children}</Text>
      </HStack>
      {/* right */}
      <Text size="sm" opacity={0.5} fontFamily="mono">
        {command}
      </Text>
    </Button>
  );
};
