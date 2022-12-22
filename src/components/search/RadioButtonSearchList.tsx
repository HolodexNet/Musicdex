import {
  Radio,
  RadioGroup,
  Input,
  VStack,
  Tag,
  InputRightElement,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseFill } from "react-icons/ri";

interface RadioButtonSearchListProps {
  dataField: string;
  placeholder?: string;
  showSearch?: boolean;
  aggregations: {
    [k: string]: { buckets: Array<{ key: string; doc_count: number }> };
  };
  setQuery: (query: any) => void;
  value: string | null;
  tagLabel?: string;
}

export const RadioButtonSearchList = ({
  dataField,
  placeholder,
  showSearch = false,
  aggregations,
  setQuery,
  value,
  tagLabel,
}: RadioButtonSearchListProps) => {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState("");
  const [radioValue, setRadioValue] = useState<string>(value!);

  const getQuery = useCallback(
    (value: string) => {
      if (!value) return {};

      return { query: { term: { [dataField]: value } } };
    },
    [dataField],
  );

  useEffect(() => {
    setQuery({
      value: radioValue,
      query: getQuery(radioValue),
    });
  }, [radioValue, getQuery, setQuery]);

  // Support resetting from SelectedFilters
  useEffect(() => {
    setRadioValue(value || "");
  }, [value]);

  if (!aggregations?.[dataField]?.buckets?.length) {
    return null;
  }

  return (
    <>
      {tagLabel && (
        <Tag colorScheme="brand" size="md" alignSelf="start">
          {tagLabel}
        </Tag>
      )}
      {showSearch && (
        <InputGroup>
          <Input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder={placeholder!}
          />
          <InputRightElement>
            {filterValue && (
              <IconButton
                color="red.400"
                colorScheme="red"
                size="sm"
                variant="ghost"
                aria-label={t("Clear")}
                icon={<RiCloseFill />}
                type="button"
                title={t("Clear")}
                onClick={() => setFilterValue("")}
              ></IconButton>
            )}
          </InputRightElement>
        </InputGroup>
      )}
      <RadioGroup value={radioValue} onChange={(value) => setRadioValue(value)}>
        <VStack maxH="200px" alignItems="stretch" overflowY="scroll" p={2}>
          {aggregations?.[dataField]?.buckets
            ?.filter(({ key }) =>
              key.toLowerCase().includes(filterValue.toLowerCase()),
            )
            .map(({ key }) => (
              <Radio key={key} value={key}>
                {key}
              </Radio>
            ))}
        </VStack>
      </RadioGroup>
    </>
  );
};
