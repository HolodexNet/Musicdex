import { Container } from "@chakra-ui/react";
import { ReactNode } from "react";

// Component to keep page padding and sizing consistent
export function PageContainer({ children }: { children?: ReactNode }) {
  return (
    <Container
      maxW={{ lg: "7xl" }}
      alignContent="stretch"
      p={{ base: 0, md: 2, xl: 4 }}
    >
      {children}
    </Container>
  );
}
