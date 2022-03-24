import { HStack, Heading, StackProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GradientLogo } from "../icons/GradientLogo";

export function LogoWithText(props: StackProps) {
  return (
    <HStack as={Link} to="/" {...props}>
      <GradientLogo
        w={6}
        h={6}
        _hover={{ transform: "translateY(-2px)" }}
        transition="transform ease-in-out 0.1s"
      />
      <Heading display="flex" fontSize="2xl">
        Musicdex
      </Heading>
      <sup>Beta</sup>
    </HStack>
  );
}
