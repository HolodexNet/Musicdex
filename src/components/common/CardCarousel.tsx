import { Flex, FlexProps, IconButton } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ReactNode, useRef, useState } from "react";
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

      ref.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }

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
        />
        <IconButton
          visibility={hideRightBtn ? "hidden" : "visible"}
          icon={<FaChevronRight />}
          aria-label="Right"
          onClick={() => scroll("right")}
          boxShadow="2xl"
        />
      </Flex>
    </Flex>
  );
}

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  position: absolute;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
  * {
    display: inline-flex;
    scroll-snap-align: end;
  }
`;
