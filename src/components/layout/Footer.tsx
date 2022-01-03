import {
  Box,
  Container,
  IconButton,
  IconButtonProps,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";
import { ContainerInlay } from "./ContainerInlay";

const SocialButton = ({ icon, ...rest }: any) => {
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
    <Box color={useColorModeValue("gray.700", "gray.200")} marginTop="auto">
      <ContainerInlay>
        <Container
          as={Stack}
          maxW={"7xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Text>
            © 2020 Holodex.{" "}
            <small>
              Musicdex is still under development, bugs and wipes may occur
              during Alpha.
            </small>
          </Text>
          <Stack direction={"row"} spacing={6}>
            <SocialButton
              aria-label="Twitter"
              icon={<FaTwitter />}
              title="Twitter"
              as="a"
              href="https://twitter.com/holodex"
              target="_blank"
            />
            <SocialButton
              aria-label="Kofi"
              icon={<SiKofi />}
              title="Ko-Fi (Support Holodex)"
              as="a"
              href="https://ko-fi.com/holodex"
              target="_blank"
            />
            <SocialButton
              aria-label="Discord"
              icon={<FaDiscord />}
              title="Discord"
              as="a"
              href="https://discord.gg/A24AbzgvRJ"
              target="_blank"
            />
          </Stack>
        </Container>
      </ContainerInlay>
    </Box>
  );
}
