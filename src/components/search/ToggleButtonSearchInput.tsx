import { Button, HStack, Tag } from "@chakra-ui/react";
import { ReactElement, useCallback, useEffect, useState } from "react";

interface ToggleButtonSearchInputProps {
  dataField: string;
  buttons: Array<{ label: string; value: string; icon?: ReactElement }>;
  setQuery: (query: { value?: string; query?: any; opts?: any }) => void;
  value: string | null;
  tagLabel?: string;
}

export const ToggleButtonSearchInput = ({
  dataField,
  setQuery,
  value,
  buttons,
  tagLabel,
}: ToggleButtonSearchInputProps) => {
  const [buttonValue, setButtonValue] = useState<string>(value!);

  const getQuery = useCallback(
    (value: string) => {
      if (!value) return {};

      return { query: { term: { [dataField]: value } } };
    },
    [dataField],
  );

  useEffect(() => {
    setQuery({
      value: buttonValue,
      query: getQuery(buttonValue),
    });
  }, [buttonValue, getQuery, setQuery]);

  // Support resetting from SelectedFilters
  useEffect(() => {
    if (value === null) setButtonValue("");
  }, [value]);

  return (
    <>
      {tagLabel && (
        <Tag colorScheme="brand" size="md" alignSelf="start">
          {tagLabel}
        </Tag>
      )}
      <HStack>
        {buttons.map(({ label, value, icon }) => {
          return (
            <Button
              colorScheme="brand"
              variant={buttonValue === value ? "solid" : "outline"}
              rightIcon={icon}
              title={label}
              onClick={() =>
                setButtonValue((currentValue: string) =>
                  currentValue === value ? "" : value,
                )
              }
            >
              {label}
            </Button>
          );
        })}
      </HStack>
    </>
  );
};
