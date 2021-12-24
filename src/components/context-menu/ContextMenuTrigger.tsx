import { Box } from "@chakra-ui/react";
import React, { MouseEvent } from "react";
import { useStoreActions, useStoreState } from "../../store";

type Props = {
  menuId: string;
  passData?: any; // pass arbitrary data to the ContextMenuList (render prop) and the ContextMenuItem (onClick function)
  onTrigger?: Function; // run an optional function on right click trigger
};

export const ContextMenuTrigger: React.FC<Props> = ({
  children,
  menuId,
  passData,
  onTrigger = () => {},
}) => {
  const contextMenusState = useStoreState((s) => s.contextMenu.menu);
  const setContextMenusState = useStoreActions((s) => s.contextMenu.setMenu);

  // when the trigger is right clicked,
  // we want to add a menu in our context or update it if it already exists
  return (
    <Box
      onContextMenu={(event: MouseEvent) => {
        // dont show the browser menu
        event.preventDefault();

        // run an optional action on trigger
        onTrigger();

        // update the position where the ContextMenuList should be shown
        setContextMenusState({
          ...contextMenusState,
          // set the passthrough data
          passData,
          // update the mouse position
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          // update which menu should be showing
          menus: contextMenusState.menus.find((m) => m.id === menuId)
            ? // open the menu if it exists and close all others
              contextMenusState.menus.map((m) => {
                if (m.id === menuId) {
                  return {
                    ...m,
                    isOpen: true,
                  };
                }
                return {
                  ...m,
                  isOpen: false,
                };
              })
            : // create the menu if it doesnt exist and close all others
              [
                {
                  id: menuId,
                  isOpen: true,
                },
                ...contextMenusState.menus.map((m) => {
                  return {
                    ...m,
                    isOpen: false,
                  };
                }),
              ],
        });
      }}
    >
      {children}
    </Box>
  );
};

export function useContextTrigger({ menuId, onTrigger = () => {} }: Props) {
  const contextMenusState = useStoreState((s) => s.contextMenu.menu);
  const setContextMenusState = useStoreActions((s) => s.contextMenu.setMenu);

  return (event: MouseEvent, passData?: any) => {
    // dont show the browser menu
    event.preventDefault();

    // run an optional action on trigger
    onTrigger();

    // update the position where the ContextMenuList should be shown
    setContextMenusState({
      ...contextMenusState,
      // set the passthrough data
      passData,
      // update the mouse position
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      // update which menu should be showing
      menus: contextMenusState.menus.find((m) => m.id === menuId)
        ? // open the menu if it exists and close all others
          contextMenusState.menus.map((m) => {
            if (m.id === menuId) {
              return {
                ...m,
                isOpen: true,
              };
            }
            return {
              ...m,
              isOpen: false,
            };
          })
        : // create the menu if it doesnt exist and close all others
          [
            {
              id: menuId,
              isOpen: true,
            },
            ...contextMenusState.menus.map((m) => {
              return {
                ...m,
                isOpen: false,
              };
            }),
          ],
    });
  };
}
