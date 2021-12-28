import { VStack, Text, Spinner, Button } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Fragment } from "react";
import { useQueryErrorResetBoundary } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";

export function QueryStatus({
  queryStatus,
}: {
  queryStatus: Partial<UseQueryResult>;
}) {
  // const { reset } = useQueryErrorResetBoundary();
  return (
    <VStack textAlign="center">
      {queryStatus.isLoading && (
        <Fragment>
          <Spinner size="xl" />
          <Text fontSize="3xl">Loading...</Text>
        </Fragment>
      )}

      {queryStatus.isError && (
        <Fragment>
          <Text fontSize="3xl" colorScheme="red">
            Error occured
          </Text>
          <Text maxWidth="100%">
            {JSON.stringify(queryStatus.error as AxiosError)}
          </Text>
          {/* <Button onClick={reset}>Retry</Button> */}
        </Fragment>
      )}
    </VStack>
  );
}
