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
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { RiSearch2Line } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

export function Searchbox(props: BoxProps) {
  const { t } = useTranslation();
  let [isFocused, setFocused] = useState(false);
  let navigate = useNavigate();
  let [searchParams] = useSearchParams();
  let [currentValue, setValue] = useState("");
  const input = useRef<any>();

  useEffect(() => {
    const q = searchParams.get("q");
    const prettyValue = q ? JSON.parse(q) : "";
    setValue(prettyValue);
    input.current.value = prettyValue;
  }, [searchParams]);

  useHotkeys("ctrl+l, cmd+l, cmd+alt+f", (e) => {
    e.preventDefault();
    input.current.focus();
  });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!currentValue) return;

    const search = new URLSearchParams(searchParams);
    search.set("q", JSON.stringify(currentValue));
    navigate({
      pathname: "/search",
      search: `?${search}`,
    });
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
            paddingRight="40px" // 40px is one button, change back to 80px if you gonna uncomment the blurry button
            ref={input}
          />
          <InputRightElement>
            <HStack>
              <IconButton
                color="green.500"
                colorScheme={isFocused ? "green" : "whiteAlpha"}
                size="sm"
                variant="outline"
                aria-label="Search"
                icon={<RiSearch2Line />}
                type="submit"
                title="Search"
              ></IconButton>
              {/* <IconButton
                size="sm"
                aria-label="Blurry Search"
                colorScheme={isFocused ? "pink" : "bgAlpha"}
                variant="outline"
                icon={<RiCompasses2Fill />}
                onClick={() => {
                  console.log("huh", currentValue);
                  if (currentValue) {
                    const newSP = new URLSearchParams(searchParams);
                    newSP.set("q", JSON.stringify(currentValue));
                    newSP.set("mode", "exact");

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
              ></IconButton> */}
            </HStack>
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
  );
}
