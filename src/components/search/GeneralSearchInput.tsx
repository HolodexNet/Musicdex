import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

interface GeneralInputProps {
  initialState?: string;
  debounceValue?: number;
  placeholder?: string;
  getQuery: (q: string) => object;
  setQuery: (query: { value?: string; query?: any; opts?: any }) => void;
  value: string | null;
}

export const GeneralSearchInput = ({
  initialState,
  debounceValue = 1000,
  placeholder,
  getQuery,
  setQuery,
  value,
}: GeneralInputProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(
    initialState ? JSON.parse(initialState) : "",
  );
  const [debouncedSearchText] = useDebounce(searchText, debounceValue);

  useEffect(() => {
    setQuery({
      value: debouncedSearchText,
      query: getQuery(debouncedSearchText),
    });
  }, [debouncedSearchText, getQuery, setQuery]);

  // Support resetting from SelectedFilters
  useEffect(() => {
    if (value === null) setSearchText("");
  }, [value]);

  return (
    <Input
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder={t(placeholder!)}
    ></Input>
  );
};
