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
        {isNew && (
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
        )}

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

        {/* Google */}
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

        {/* LinkedIn */}
        <Button
          w={"full"}
          colorScheme={"twitter"}
          leftIcon={<FaTwitter />}
          onClick={TwitterAuth}
        >
          <Center>
            <Text>Login with Twitter</Text>
          </Center>
        </Button>
      </Stack>
    </Center>
  );
}
