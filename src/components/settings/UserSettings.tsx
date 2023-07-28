import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Center,
  HStack,
  Avatar,
  VStack,
  Text,
  Tag,
  TagLeftIcon,
  TagLabel,
  Tooltip,
  Wrap,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns-tz";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDiscord, FaGoogle, FaTwitter } from "react-icons/fa";
import { useMutation } from "react-query";
import { useClient } from "../../modules/client";
import { LoginButtons } from "../login/LoginButtons";
import { LoginPanel } from "../login/LoginPanel";
import { SettingsSection } from "./SettingsSection";

export function UserSettings() {
  const toast = useToast({
    position: "top-right",
  });
  const { t } = useTranslation();
  const { isLoggedIn, user, AxiosInstance, refreshUser } = useClient();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [newUsername, setNewUsername] = useState("");

  const { mutate: changeName, isLoading } = useMutation(
    async (payload: string) =>
      (
        await AxiosInstance("/user/", {
          method: "POST",
          data: { name: payload },
        })
      ).data,
    {
      onSuccess: (data, payload, ...rest) => {
        refreshUser();
        toast({
          title: t("Username changed"),
          status: "success",
        });
        setNewUsername("");
      },
    },
  );
  if (!isLoggedIn) {
    return (
      <Center>
        <LoginPanel />
      </Center>
    );
  }
  return (
    <>
      <HStack
        w="full"
        justify="center"
        p={{ base: 2, md: 8 }}
        spacing={{ base: 6, md: 12 }}
      >
        <Avatar
          boxSize={{ base: 24, md: 48 }}
          bg="transparent"
          src={`https://avatars.dicebear.com/api/jdenticon/${user?.id}.svg`}
        />
        <VStack
          w={{ base: undefined, md: "full" }}
          align="flex-start"
          spacing={{ base: 0, md: 2 }}
        >
          <Heading
            size={{ base: "xl", md: "2xl" }}
            fontWeight="black"
            wordBreak="break-all"
          >
            {user?.username}
          </Heading>
          <Text
            textTransform="capitalize"
            fontSize={{ base: "xl", md: "2xl" }}
            color="gray.500"
          >
            {user?.role} - {user?.contribution_count}pts
          </Text>
          <Wrap>
            <Tooltip label={user?.google_id}>
              <Tag colorScheme={user?.google_id ? "n2" : "whiteAlpha"}>
                <TagLeftIcon as={FaGoogle} />
                {!isMobile && <TagLabel>Google</TagLabel>}
              </Tag>
            </Tooltip>
            <Tooltip label={user?.discord_id}>
              <Tag colorScheme={user?.discord_id ? "n2" : "whiteAlpha"}>
                <TagLeftIcon as={FaDiscord} />
                {!isMobile && <TagLabel>Discord</TagLabel>}
              </Tag>
            </Tooltip>
            <Tooltip label={user?.twitter_id}>
              <Tag colorScheme={user?.twitter_id ? "n2" : "whiteAlpha"}>
                <TagLeftIcon as={FaTwitter} />
                {!isMobile && <TagLabel>Twitter</TagLabel>}
              </Tag>
            </Tooltip>
          </Wrap>
          {user?.created_at && (
            <Text color="gray.500">
              {t("Joined {{created_at}}", {
                created_at: format(new Date(user.created_at), "yyyy-MM-dd"),
              })}
            </Text>
          )}
        </VStack>
      </HStack>
      <SettingsSection title={t("Change Username")}>
        <InputGroup>
          <Input
            placeholder={t("Username")}
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value.trim())}
          />
          <InputRightElement w="fit-content">
            <Button
              roundedLeft="none"
              isDisabled={!newUsername}
              isLoading={isLoading}
              onClick={() => changeName(newUsername)}
            >
              {t("Change")}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Center w="full"></Center>
      </SettingsSection>
      <SettingsSection title={t("Connect more accounts to Musicdex")}>
        <LoginButtons />
      </SettingsSection>
    </>
  );
}
