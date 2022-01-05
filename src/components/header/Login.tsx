import {
  Center,
  Stack,
  Button,
  Text,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { FaDiscord, FaGoogle, FaTwitter } from "react-icons/fa";

export function LoginButtons({ isNew = true }: { isNew?: boolean }) {
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
        <Button w={"full"} colorScheme={"purple"} leftIcon={<FaDiscord />}>
          <Center>
            <Text>Login with Discord</Text>
          </Center>
        </Button>

        {/* Google */}
        <Button w={"full"} colorScheme={"red"} leftIcon={<FaGoogle />}>
          <Center>
            <Text>Login with Google</Text>
          </Center>
        </Button>

        {/* LinkedIn */}
        <Button w={"full"} colorScheme={"twitter"} leftIcon={<FaTwitter />}>
          <Center>
            <Text>Login with Twitter</Text>
          </Center>
        </Button>
      </Stack>
    </Center>
  );
}
