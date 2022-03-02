import { BoxProps, Center, Text } from "@chakra-ui/react";
import { ErrorFallback } from "../../ErrorFallback";
import { useClient } from "../../modules/client";

export function XHRError({ error, ...props }: BoxProps & { error?: Error }) {
  const { isLoggedIn } = useClient();
  return (
    <Center {...props}>
      {isLoggedIn ? (
        error ? (
          // <Text>You are logged in, but there has been an error.</Text>
          <ErrorFallback
            error={error}
            resetErrorBoundary={() => {
              console.log("Error Reset");
            }}
          />
        ) : (
          <Text>An unknown error occurred...</Text>
        )
      ) : (
        <Text my="20vh">
          Unfortunately it looks like you need to login to use this feature.
        </Text>
      )}
    </Center>
  );
}
