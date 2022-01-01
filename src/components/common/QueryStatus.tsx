import { VStack, Text, Spinner, StackProps } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Fragment } from "react";
import { useQueryErrorResetBoundary } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";

interface QueryStatusProps extends StackProps {
  queryStatus: Partial<UseQueryResult>;
}

export function QueryStatus({ queryStatus, ...rest }: QueryStatusProps) {
  // const { reset } = useQueryErrorResetBoundary();
  return (
    <VStack textAlign="center" {...rest}>
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
