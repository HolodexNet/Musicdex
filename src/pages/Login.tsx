import { LoginButtons } from "../components/header/Login";
import { ContainerInlay } from "../components/layout/ContainerInlay";
import { PageContainer } from "../components/layout/PageContainer";

export default function Login() {
  return (
    <PageContainer>
      <ContainerInlay>
        <LoginButtons></LoginButtons>
      </ContainerInlay>
    </PageContainer>
  );
}
