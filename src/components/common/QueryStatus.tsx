import {
  VStack,
  Flex,
  Heading,
  Text,
  Spinner,
  StackProps,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { UseQueryResult } from "react-query/types/react/types";
import { ErrorFallback } from "./ErrorFallback";

interface QueryStatusProps extends StackProps {
  queryStatus: Partial<UseQueryResult>;
}

export function QueryStatus({ queryStatus, ...rest }: QueryStatusProps) {
  const { t } = useTranslation();

  return (
    <VStack textAlign="center" h="100%" w="100%" {...rest}>
      {queryStatus.isLoading && (
        <Flex
          h="100%"
          w="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={4}
        >
          <Spinner size="xl" />
          <Text fontSize="2xl">{t("Loading...")}</Text>
        </Flex>
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
