import {
  Box,
  chakra,
  Container,
  IconButton,
  IconButtonProps,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";

const SocialButton = ({ icon, ...rest }: IconButtonProps) => {
  return (
    <IconButton
      bg={useColorModeValue("bg.100", "bg.100")}
      size="sm"
      rounded="full"
      colorScheme="brand"
      icon={icon}
      {...rest}
    ></IconButton>
  );
};

export default function Footer() {
  return (
    <Box color={useColorModeValue("gray.700", "gray.200")}>
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>© 2019 Holodex</Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton aria-label="Twitter" icon={<FaTwitter />} />
          <SocialButton aria-label="Kofi" icon={<SiKofi />} />
          <SocialButton aria-label="Discord" icon={<FaDiscord />} />
        </Stack>
      </Container>
    </Box>
  );
}
