import { Center } from "@chakra-ui/react";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";
import { LoginPanel } from "../components/login/LoginPanel";

export default function Login() {
  return (
    <PageContainer>
      <ContainerInlay>
        <Center p={8}>
          <LoginPanel />
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}
