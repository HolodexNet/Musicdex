import {
  Box,
  BoxProps,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiFilter, FiSearch } from "react-icons/fi";
import { RiCompasses2Fill, RiSearch2Line } from "react-icons/ri";
import { useNavigate } from "react-router";
import { createSearchParams, useSearchParams } from "react-router-dom";

export function Searchbox({ ...props }: BoxProps & {}) {
  const { t } = useTranslation();
  let [isFocused, setFocused] = useState(false);
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  let [currentValue, setValue] = useState("");
  const input = useRef<any>();

  useEffect(() => {
    const q = searchParams.get("q");
    const pq = q && JSON.parse(q);
    setValue(pq || "");
    input.current.value = pq || "";
  }, [searchParams]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (currentValue) {
      const newSP = new URLSearchParams(searchParams);
      newSP.delete("q");
      newSP.delete("mode");
      newSP.append("q", JSON.stringify(currentValue));
      newSP.append("mode", "fuzzy");

      // const isChanged =
      //   newSP.get("q") === searchParams.get("q") &&
      //   newSP.get("mode") === searchParams.get("mode");

      navigate({
        pathname: "/searchV2",
        search: `?${newSP}`,
      });
    }
  };

  return (
    <Box {...props}>
      <form onSubmit={submitHandler}>
        <InputGroup>
          <Input
            variant="filled"
            placeholder={t("Search for VTubers, songs, original artists...")}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.currentTarget.value)}
            paddingRight="80px"
            ref={input}
          />
          <InputRightElement width="80px">
            <HStack>
              <IconButton
                color="green.500"
                colorScheme={isFocused ? "green" : "whiteAlpha"}
                size="sm"
                variant="outline"
                aria-label="Search"
                icon={<RiSearch2Line />}
                type="submit"
                title="Fuzzy Search"
              ></IconButton>
              <IconButton
                size="sm"
                aria-label="Blurry Search"
                colorScheme={isFocused ? "pink" : "bgAlpha"}
                variant="outline"
                icon={<RiCompasses2Fill />}
                onClick={() => {
                  console.log("huh", currentValue);
                  if (currentValue) {
                    const newSP = new URLSearchParams(searchParams);
                    newSP.delete("q");
                    newSP.delete("mode");
                    newSP.append("q", JSON.stringify(currentValue));
                    newSP.append("mode", "exact");

                    const isChanged =
                      newSP.get("q") === searchParams.get("q") &&
                      newSP.get("mode") === searchParams.get("mode");

                    navigate({
                      pathname: "/searchV2",
                      search: `?${newSP}`,
                    });
                  }
                }}
                title="Exact Search"
              ></IconButton>
            </HStack>
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
  );
}
