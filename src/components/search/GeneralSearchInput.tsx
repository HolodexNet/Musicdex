import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiSearch2Line } from "react-icons/ri";
import { useDebounce } from "use-debounce";

interface GeneralInputProps {
  debounceValue?: number;
  placeholder?: string;
  getQuery: (q: string) => object;
  setQuery: (query: { value?: string; query?: any; opts?: any }) => void;
  value: string | null;
  tagLabel?: string;
}

export const GeneralSearchInput = ({
  debounceValue = 1000,
  placeholder,
  getQuery,
  setQuery,
  value,
  tagLabel,
}: GeneralInputProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>(value!);
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
    <>
      {tagLabel && (
        <Tag colorScheme="brand" size="md" alignSelf="start">
          {tagLabel}
        </Tag>
      )}
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
            placeholder={placeholder}
          ></Input>
          <InputRightElement>
            <IconButton
              color="brand.400"
              colorScheme="brand"
              size="sm"
              variant="ghost"
              aria-label={t("Search")}
              icon={<RiSearch2Line />}
              type="submit"
              title={t("Search")}
            ></IconButton>
          </InputRightElement>
        </InputGroup>
      </form>
    </>
  );
};
