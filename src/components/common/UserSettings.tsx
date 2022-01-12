import {
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Center,
  Avatar,
  AvatarBadge,
  IconButton,
  Button,
  Input,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useClient } from "../../modules/client";
import { LoginButtons } from "../header/Login";

export function UserSettings() {
  const { isLoggedIn } = useClient();
  return (
    <Stack w="full" direction="row" alignItems="stretch">
      {isLoggedIn && (
        <Stack spacing={4} align={"center"} maxW={"md"} w={"full"} py={8}>
          <FormControl id="userName" isRequired>
            <FormLabel>Change Username</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      )}
      <Box flex={1}>
        <LoginButtons isNew={!isLoggedIn}></LoginButtons>
      </Box>
    </Stack>
  );
}
