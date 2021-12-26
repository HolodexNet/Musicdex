import { useColorModeValue, useOutsideClick } from "@chakra-ui/react";
import { Variants } from "framer-motion";
import React, {
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStoreActions, useStoreState } from "../../store";
import { MotionBox, MotionBoxProps } from "./MotionBox";

type Props = {
  menuId: string;
  render?: (x: {
    menuId: string;
    closeContextMenus: () => void;
    passData: any;
  }) => ReactNode;
};

const motionVariants: Variants = {
  enter: {
    visibility: "visible",
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    transitionEnd: {
      visibility: "hidden",
    },
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.1,
      easings: "easeOut",
    },
  },
};

type Position = {
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
};

export const ContextMenuList: React.FC<Props & MotionBoxProps> = ({
  children,
  menuId,
  render,
  ...boxProps
}) => {
  const contextMenusState = useStoreState((s) => s.contextMenu.menu);
  const setContextMenusState = useStoreActions((s) => s.contextMenu.setMenu);

  const menuRef: RefObject<HTMLDivElement> = useRef(null);

  const menu = useMemo(
    () => contextMenusState.menus.find((m) => m.id === menuId),
    [contextMenusState]
  );

  // where should the menu be shown?
  // the ContextMenuTrigger sets this
  const [position, setPosition] = useState<Position>({
    left: -3000,
    right: "auto",
    top: -3000,
    bottom: "auto",
  });

  // TODO: Any less manual way to do this
  // figure out where to show the menu
  useEffect(() => {
    let left: number | undefined;
    let right: number | undefined;
    let top: number | undefined;
    let bottom: number | undefined;

    const x = contextMenusState.position.x;
    const y = contextMenusState.position.y;

    const menuHeight = menuRef?.current?.clientHeight;
    const menuWidth = menuRef?.current?.clientWidth;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (!menuHeight || !menuWidth) {
      return;
    }
    if (x + menuWidth > windowWidth) {
      right = windowWidth - x;
    } else {
      left = x;
    }
    if (y + menuHeight > windowHeight) {
      bottom = windowHeight - y;
    } else {
      top = y;
    }
    setPosition({
      top: `${top}px`,
      bottom: `${bottom}px`,
      left: `${left}px`,
      right: `${right}px`,
    });
  }, [menuRef, contextMenusState.position.x, contextMenusState.position.y]);

  // when clicking outside the menu, close it
  useOutsideClick({
    ref: menuRef as RefObject<HTMLDivElement>,
    handler: () => {
      // close all menus
      closeContextMenus();
    },
  });

  const bgColor = useColorModeValue("gray.50", "#2b313e");

  const closeContextMenus = () => {
    setContextMenusState({
      passData: contextMenusState.passData,
      position: {
        x: -10000,
        y: -10000,
      },
      menus: contextMenusState.menus.map((m) => ({
        ...m,
        isOpen: false,
      })),
    });
  };

  return (
    <MotionBox
      variants={motionVariants}
      animate={menu?.isOpen ? "enter" : "exit"}
      ref={menuRef}
      borderWidth={1}
      shadow="lg"
      position="fixed"
      bg={bgColor}
      py={1}
      minW={40}
      w={52}
      // maxW={96}
      borderRadius="md"
      display="flex"
      flexDirection="column"
      zIndex="popover"
      {...position}
      {...boxProps}
    >
      {/* either use the render prop or the children */}
      {render
        ? render({
            menuId,
            closeContextMenus,
            passData: contextMenusState.passData,
          })
        : children}
    </MotionBox>
  );
};
