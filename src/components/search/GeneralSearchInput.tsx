import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseFill, RiSearch2Line } from "react-icons/ri";
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
  const [debouncedSearchText, { flush }] = useDebounce(
    searchText,
    debounceValue,
  );

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        flush();
      }}
    >
      <InputGroup>
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={t(placeholder!)}
        ></Input>
        <InputRightElement>
          <IconButton
            color="brand.400"
            colorScheme="brand"
            size="sm"
            variant="ghost"
            aria-label="Search"
            icon={<RiSearch2Line />}
            type="submit"
            title="Search"
          ></IconButton>
        </InputRightElement>
      </InputGroup>
    </form>
  );
};
