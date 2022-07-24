import { Button, HStack, Tag } from "@chakra-ui/react";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiSearch2Line } from "react-icons/ri";

interface ToggleButtonSearchInputProps {
  initialValue?: string;
  dataField: string;
  buttons: Array<{ label: string; value: string; icon?: ReactElement }>;
  setQuery: (query: { value?: string; query?: any; opts?: any }) => void;
  value: string | null;
  tagLabel?: string;
}

export const ToggleButtonSearchInput = ({
  initialValue,
  dataField,
  setQuery,
  value,
  buttons,
  tagLabel,
}: ToggleButtonSearchInputProps) => {
  console.log(value, buttons);
  const { t } = useTranslation();
  const [buttonValue, setButtonValue] = useState(
    initialValue ? JSON.parse(initialValue) : "",
  );

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
  //
  // // Support resetting from SelectedFilters
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
