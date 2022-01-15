import {
  Center,
  Stack,
  Button,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { FaDiscord, FaGoogle, FaTwitter } from "react-icons/fa";
import { useClientLogin } from "../../modules/client";

export function LoginButtons({ isNew = true }: { isNew?: boolean }) {
  const { DiscordOAuth, GoogleAuthFn, TwitterAuth } = useClientLogin();
  return (
    <Center p={8}>
      <Stack spacing={4} align={"center"} maxW={"md"} w={"full"}>
        {isNew ? (
          <>
            <Heading>Login/Sign up to Musicdex</Heading>
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

        {DiscordOAuth && (
          <DiscordOAuth w={"full"}>
            <Button
              w={"full"}
              colorScheme={"purple"}
              leftIcon={<FaDiscord />}
              as="div"
            >
              <Center>
                <Text>Login with Discord</Text>
              </Center>
            </Button>
          </DiscordOAuth>
        )}

        {/* Google */}
        {GoogleAuthFn && (
          <Button
            w={"full"}
            colorScheme={"red"}
            leftIcon={<FaGoogle />}
            onClick={GoogleAuthFn}
          >
            <Center>
              <Text>Login with Google</Text>
            </Center>
          </Button>
        )}

        {/* LinkedIn */}
        {TwitterAuth && (
          <Button
            w={"full"}
            colorScheme={"twitter"}
            disabled
            leftIcon={<FaTwitter />}
            onClick={TwitterAuth}
          >
            <Center>
              <Text>Login with Twitter (broken until beta)</Text>
            </Center>
          </Button>
        )}
      </Stack>
    </Center>
  );
}
