import {
  Center,
  Stack,
  Button,
  Text,
  Heading,
  Divider,
  Box,
} from "@chakra-ui/react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { useClientLogin } from "../../modules/client";
import GoogleButton from "./GoogleButton";

export function LoginButtons({ isNew = true }: { isNew?: boolean }) {
  const { DiscordOAuth, GoogleAuthFn, TwitterAuth } = useClientLogin();
  return (
    <Center p={8}>
      <Stack spacing={4} align={"center"} maxW={"md"} w={"full"}>
        {isNew ? (
          <>
            <Heading size="lg">Login/Sign up to Musicdex</Heading>
            <Divider width={12} py={2} />
            <Text>
              If you have not previously logged into <b>Holodex</b> or{" "}
              <b>Musicdex</b> with the social account, a new account will be
              created automatically. <br />
              <br />
              You will be able to connect other social accounts after logging
              in.
            </Text>
          </>
        ) : (
          <>
            <Heading size="md">Connect more accounts to Musicdex</Heading>
            <Text>
              No particular reason, maybe you find it easier to login using one
              or another method on a different device.
            </Text>
          </>
        )}
        <Box maxW={400} w={"full"}>
          {DiscordOAuth && (
            <Button
              w={"full"}
              h={30}
              colorScheme={"purple"}
              leftIcon={<FaDiscord />}
              onClick={DiscordOAuth}
              as="div"
            >
              <Text mx="auto">Login with Discord</Text>
            </Button>
          )}

          {/* Google */}
          {GoogleAuthFn && (
            <GoogleButton
              onCredentialResponse={GoogleAuthFn}
              my={4}
            ></GoogleButton>
          )}

          {/* LinkedIn */}
          {TwitterAuth && (
            <Button
              w={"full"}
              h={30}
              colorScheme={"twitter"}
              leftIcon={<FaTwitter />}
              onClick={TwitterAuth}
              as="div"
            >
              <Text mx="auto">Login with Twitter</Text>
            </Button>
          )}
        </Box>
      </Stack>
    </Center>
  );
}
