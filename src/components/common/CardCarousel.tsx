import { Flex, FlexProps, IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CardCarouselProps extends FlexProps {
  children: ReactNode;
  height: number;
  width: number;
  scrollMultiplier: number;
}

export function CardCarousel({
  children,
  height,
  width,
  scrollMultiplier = 1,
  ...rest
}: CardCarouselProps) {
  const ref = useRef<any>(null);
  const [hideLeftBtn, setHideLeftBtn] = useState(true);
  const [hideRightBtn, setHideRightBtn] = useState(false);
  function scroll(direction: "left" | "right") {
    if (ref?.current) {
      const scrollAmount =
        (direction === "left" ? -1 : 1) * scrollMultiplier * width;

      if (
        direction === "left" &&
        ref.current.scrollLeft + scrollAmount <= width / 2 - 1
      ) {
        ref.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        ref.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  }

  // Watch for children cards to load in and check if it's scrollable
  useEffect(() => {
    if (ref?.current) {
      // Reset scroll to 0
      ref.current.scrollTo({
        left: 0,
      });

      // check if should hide arrows, b/c content changed
      const shouldHideBtn = ref.current.clientWidth === ref.current.scrollWidth;
      const curLeft = ref.current.scrollLeft;
      setHideRightBtn(shouldHideBtn);
      setHideLeftBtn(curLeft === 0 || shouldHideBtn);
    }
  }, [children]);
  function onScroll() {
    const curLeft = ref.current.scrollLeft;
    const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
    if (curLeft <= width / 2 - 1) {
      setHideLeftBtn(true);
    } else if (curLeft >= maxScroll - width / 2 - 1) {
      setHideRightBtn(true);
    } else {
      setHideLeftBtn(false);
      setHideRightBtn(false);
    }
  }
  return (
    <Flex {...rest}>
      <Flex
        position="relative"
        height={`${height}px`}
        minHeight={`${height}px`}
        alignItems="center"
        justifyContent="space-between"
        flex="1"
      >
        <SliderContainer ref={ref} onScroll={onScroll}>
          {children}
        </SliderContainer>
        <IconButton
          visibility={hideLeftBtn ? "hidden" : "visible"}
          icon={<FaChevronLeft />}
          aria-label="Left"
          onClick={() => scroll("left")}
          boxShadow="2xl"
          ml={["5px", null, null, null, null, "-20px"]}
        />
        <IconButton
          visibility={hideRightBtn ? "hidden" : "visible"}
          icon={<FaChevronRight />}
          aria-label="Right"
          onClick={() => scroll("right")}
          boxShadow="2xl"
          mr={["5px", null, null, null, null, "-20px"]}
        />
      </Flex>
    </Flex>
  );
}

const SliderContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  position: absolute;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  & > * {
    scroll-snap-align: end;
  }

  & > *:first-of-type {
    margin-left: 0px;
    scroll-snap-align: start;
  }

  & > *:last-of-type {
    margin-right: 0px;
    scroll-snap-align: end;
  }
`;
