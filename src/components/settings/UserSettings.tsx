import {
  Button,
  Input,
  Divider,
  Heading,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useClient } from "../../modules/client";
import { LoginButtons } from "../login/LoginButtons";
import { LoginPanel } from "../login/LoginPanel";

export function UserSettings() {
  const { t } = useTranslation();
  const { isLoggedIn, AxiosInstance, refreshUser } = useClient();

  const ref = useRef<any>();

  const { mutate: changeName } = useMutation(
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
      },
    }
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
      <Flex flexWrap="wrap" my={6} minH={100} justifyContent={"center"}>
        <Flex flexBasis={200} flexGrow={1} mb={2}>
          <Heading size={"md"}>{t("Change Username")}</Heading>
        </Flex>
        <Flex
          flexBasis={400}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            placeholder="Username"
            _placeholder={{ color: "gray.500" }}
            type="text"
            ref={ref}
          />
          <Center>
            <Button
              bg={"blue.400"}
              maxW={200}
              mt={2}
              onClick={() => {
                const newname = ref.current.value;
                if (newname && newname.trim().length > 0) {
                  changeName(newname);
                }
              }}
            >
              {t("Change")}
            </Button>
          </Center>
        </Flex>
      </Flex>
      <Divider />
      <Flex flexWrap="wrap" my={6} justifyContent={"center"} minH={100}>
        <Flex flexBasis={200} flexGrow={1} mb={2}>
          <Heading size={"md"}>
            {t("Connect more accounts to Musicdex")}
          </Heading>
        </Flex>
        <Flex flexBasis={400} justifyContent="center" alignItems="center">
          <LoginButtons />
        </Flex>
      </Flex>
      <Divider />
    </>
  );
}
