import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";

export function Searchbox(): JSX.Element {
  let [isFocused, setFocused] = useState(false);
  return (
    <Box w={"40%"}>
      <InputGroup>
        <Input
          variant="filled"
          placeholder="Search for VTubers, songs, original artists..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <InputRightElement width="80px">
          <HStack>
            <IconButton
              color="green.400"
              bgColor={isFocused ? "green.100" : "whiteAlpha.200"}
              size="sm"
              aria-label="Search"
              icon={<FiSearch />}
            ></IconButton>
            <IconButton
              size="sm"
              aria-label="Advanced Search"
              icon={<FiFilter />}
            ></IconButton>
          </HStack>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
