import { VStack, Text, Spinner, StackProps } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Fragment } from "react";
import { UseQueryResult } from "react-query/types/react/types";
import { ErrorFallback } from "./ErrorFallback";

interface QueryStatusProps extends StackProps {
  queryStatus: Partial<UseQueryResult>;
}

export function QueryStatus({ queryStatus, ...rest }: QueryStatusProps) {
  return (
    <VStack textAlign="center" {...rest}>
      {queryStatus.isLoading && (
        <Fragment>
          <Spinner size="xl" />
          <Text fontSize="3xl">Loading...</Text>
        </Fragment>
      )}

      {queryStatus.isError && (
        <ErrorFallback
          error={queryStatus.error as AxiosError}
          resetErrorBoundary={() => window.location.reload()}
        ></ErrorFallback>
      )}
    </VStack>
  );
}
