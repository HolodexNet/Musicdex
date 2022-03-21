import {
  Stack,
  FormControl,
  FormLabel,
  Button,
  Input,
  Box,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useClient } from "../../modules/client";
import { LoginButtons } from "../header/Login";

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

  return (
    <Stack w="full" direction="row" alignItems="stretch">
      {isLoggedIn && (
        <Stack spacing={4} align={"center"} maxW={"md"} w={"full"} py={8}>
          <FormControl id="userName" isRequired>
            <FormLabel>{t("Change Username")}</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              ref={ref}
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
              onClick={() => {
                const newname = ref.current.value;
                if (newname && newname.trim().length > 0) {
                  changeName(newname);
                }
              }}
            >
              {t("Change")}
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
