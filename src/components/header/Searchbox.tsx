import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { jsx } from "@emotion/react";
import { FiSearch } from "react-icons/fi";

export const Searchbox: React.FC = () => {
  return (
    <Box w={"40%"}>
      <InputGroup>
        <Input
          variant="filled"
          placeholder="Search for VTubers, songs, original artists..."
        />
        <InputRightElement>
          <IconButton aria-label="Search" icon={<FiSearch />}></IconButton>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};
