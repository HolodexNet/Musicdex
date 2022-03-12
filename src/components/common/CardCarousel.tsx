import { Flex, FlexProps, IconButton, IconButtonProps } from "@chakra-ui/react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  Children,
} from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  isTouchDevice,
  SnapItem,
  SnapList,
  useScroll,
  useVisibleElements,
} from "react-snaplist-carousel";

interface CardCarouselProps extends FlexProps {
  children: ReactNode;
  scrollAmount?: number;
}

const defaultScrollBtnProps: Partial<IconButtonProps> = {
  boxShadow: "2xl",
  opacity: 0.6,
  _hover: { opacity: 1 },
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
};

export function CardCarousel({
  children,
  scrollAmount = 1,
  ...rest
}: CardCarouselProps) {
  const ref = useRef<any>(null);
  const [hideLeftBtn, setHideLeftBtn] = useState(true);
  const [hideRightBtn, setHideRightBtn] = useState(true);
  const maxLength = children ? React.Children.count(children) : -1;
  const goToItem = useScroll({ ref });
  const visible = useVisibleElements(
    { debounce: 10, ref },
    (elements) => elements
  );

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const next =
        visible[visible.length - 1] +
        scrollAmount * (direction === "left" ? -1 : 1);
      goToItem(Math.max(0, Math.min(next, maxLength - 1)));
    },
    [goToItem, visible, scrollAmount, maxLength]
  );

  useEffect(() => {
    if (maxLength > 0) {
      setHideRightBtn(visible[visible.length - 1] >= maxLength - 1);
      setHideLeftBtn(visible[0] === 0);
    }
  }, [maxLength, visible]);

  return (
    <Flex position="relative">
      <SnapList direction={"horizontal"} ref={ref} className="snap-no-margin">
        {Children.map(children, (child) => {
          return (
            <SnapItem snapAlign="end" key={"snap" + (child as any)?.key}>
              {child}
            </SnapItem>
          );
        })}
      </SnapList>
      <IconButton
        visibility={hideLeftBtn ? "hidden" : "visible"}
        icon={<FaChevronLeft />}
        aria-label="Left"
        onClick={() => scroll("left")}
        ml={["5px", null, null, null, null, "-20px"]}
        {...defaultScrollBtnProps}
      />
      <IconButton
        visibility={hideRightBtn ? "hidden" : "visible"}
        icon={<FaChevronRight />}
        aria-label="Right"
        onClick={() => scroll("right")}
        mr={["5px", null, null, null, null, "-20px"]}
        right="0"
        {...defaultScrollBtnProps}
      />
    </Flex>
  );
}
