import { Radio, RadioGroup, Input, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface RadioButtonSearchListProps {
  dataField: string;
  placeholder?: string;
  showSearch?: boolean;
  aggregations: {
    [k: string]: { buckets: Array<{ key: string; doc_count: number }> };
  };
  setQuery: (query: any) => void;
  value: string | null;
}

export const RadioButtonSearchList = ({
  dataField,
  placeholder,
  showSearch = false,
  aggregations,
  setQuery,
  value,
}: RadioButtonSearchListProps) => {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState("");
  const [radioValue, setRadioValue] = useState<string>("");

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
    if (value === null) setRadioValue("");
  }, [value]);

  return (
    <>
      {showSearch && (
        <Input
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          placeholder={t(placeholder!)}
        />
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
