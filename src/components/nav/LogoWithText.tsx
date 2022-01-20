import { HStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GradientLogo } from "../icons/GradientLogo";

export function LogoWithText() {
  return (
    <HStack display={{ base: "none", md: "flex" }} as={Link} to="/">
      <GradientLogo
        w={6}
        h={6}
        _hover={{ transform: "translateY(-2px)" }}
        transition="transform ease-in-out 0.1s"
      />
      <Heading display={{ base: "flex", lg: "flex" }} fontSize="2xl">
        Musicdex
      </Heading>
    </HStack>
  );
}
