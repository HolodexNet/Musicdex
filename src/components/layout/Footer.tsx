import {
  Box,
  Container,
  IconButton,
  IconButtonProps,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";
import { ContainerInlay } from "./ContainerInlay";

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
            <Link href="https://twitter.com/holodex" isExternal={true}>
              <SocialButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                title="Twitter"
              />
            </Link>
            <Link href="https://ko-fi.com/holodex" isExternal={true}>
              <SocialButton
                aria-label="Kofi"
                as={Link}
                icon={<SiKofi />}
                title="Ko-Fi (Support Holodex)"
              />
            </Link>
            <Link href="https://discord.gg/A24AbzgvRJ" isExternal={true}>
              <SocialButton
                aria-label="Discord"
                icon={<FaDiscord />}
                title="Discord"
              />
            </Link>
          </Stack>
        </Container>
      </ContainerInlay>
    </Box>
  );
}
