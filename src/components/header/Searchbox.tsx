import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

export function Searchbox(): JSX.Element {
  let [isFocused, setFocused] = useState(false);
  let navigate = useNavigate();

  let [currentValue, setValue] = useState("");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (currentValue)
      navigate({
        pathname: "/search",
        search: `?${createSearchParams({
          q: currentValue,
        })}`,
      });
  };

  return (
    <Box w={"40%"}>
      <form onSubmit={submitHandler}>
        <InputGroup>
          <Input
            variant="filled"
            placeholder="Search for VTubers, songs, original artists..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.currentTarget.value)}
            paddingRight="80px"
          />
          <InputRightElement width="80px">
            <HStack>
              <IconButton
                color="green.500"
                colorScheme={isFocused ? "green" : "whiteAlpha"}
                size="sm"
                aria-label="Search"
                icon={<FiSearch />}
                type="submit"
              ></IconButton>
              <IconButton
                size="sm"
                aria-label="Advanced Search"
                colorScheme={isFocused ? "n2" : "bgAlpha"}
                variant="outline"
                icon={<FiFilter />}
                onClick={() => {
                  navigate({
                    pathname: "/search",
                    search: `?${createSearchParams({
                      advanced: "1",
                      q: currentValue,
                    })}`,
                  });
                }}
              ></IconButton>
            </HStack>
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
  );
}
