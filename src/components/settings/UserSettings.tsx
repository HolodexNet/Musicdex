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
import { SettingsSection } from "./SettingsSection";

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
      <SettingsSection title={t("Change Username")}>
        <Input
          placeholder="Username"
          _placeholder={{ color: "gray.500" }}
          type="text"
          ref={ref}
        />
        <Center w="full">
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
      </SettingsSection>
      <SettingsSection title={t("Connect more accounts to Musicdex")}>
        <LoginButtons />
      </SettingsSection>
    </>
  );
}
