import { Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useClient } from "../../modules/client";
import { LoginButtons } from "../header/Login";
import { ContainerInlay } from "../layout/ContainerInlay";
import { PageContainer } from "../layout/PageContainer";

export function RequireLogin({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useClient();

  if (isLoggedIn) return <>{children}</>;

  return (
    <PageContainer>
      <ContainerInlay>
        <Center flexDirection="column">
          <Text fontSize="xl">
            Unfortunately it looks like you need to login to use this feature.
          </Text>
          <LoginButtons />
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}
