import {
  Box,
  BoxProps,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import emojiMartData from "@emoji-mart/data/sets/13.1/native.json";
import { intervalToDuration } from "date-fns";
import { Picker } from "emoji-mart";
import debounce from "lodash-es/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiFolder } from "react-icons/fi";
import { splitPlaylistEmoji } from "../../modules/playlist/utils";

type PlaylistHeadingEditorProps = {
  title: string;
  description: string;
  setTitle: (text: string | undefined) => void;
  setDescription: (text: string | undefined) => void;
  count: number;
  totalLengthSecs?: number;
  max?: number;
};

export default function PlaylistHeadingEditor({
  title,
  description,
  setTitle,
  setDescription,
  count,
  totalLengthSecs,
  max = 500,
  ...props
}: PlaylistHeadingEditorProps & BoxProps) {
  const descColor = useColorModeValue("gray.800", "gray.200");

  const { emoji, rest } = useMemo(() => {
    return splitPlaylistEmoji(title);
  }, [title]);

  const [changedEmoji, changeEmoji] = useState<string | undefined>();
  const [changedTitle, changeTitle] = useState<string | undefined>();

  const [titleInvalid, setTitleInvalid] = useState(false);
  const [descInvalid, setDescInvalid] = useState(false);

  useEffect(() => {
    const finalTitle = `${changedEmoji ?? emoji ?? ""}${changedTitle ?? rest}`;
    if (changedEmoji !== undefined || changedTitle !== undefined) {
      setTitle(finalTitle);
    }
  }, [setTitle, emoji, rest, changedEmoji, changedTitle]);

  const emojiMartRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const p = new Picker({
      ref: emojiMartRef,
      data: emojiMartData,
      categories: [
        "custom_1",
        "frequent",
        ...emojiMartData.categories.map((c) => c.id),
      ],
      custom: [
        {
          name: "Clear Emoji",
          emojis: [
            {
              id: "clear-emoji",
              name: "Clear Emoji",
              keywords: ["null", "empty", "clear"],
              skins: [
                {
                  native: "-",
                },
              ],
              version: 1,
            },
          ],
        },
      ],
      theme: "dark",
      maxFrequentRows: 0,
      onEmojiSelect: (s: any) => {
        changeEmoji(s.id === "clear-emoji" ? "" : s.native);
      },
    });
    return () => {
      p.remove();
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const titleChangeHandler = useCallback(
    debounce((text: string) => {
      const valid = isValid(text, 1, 70);
      setTitleInvalid(!valid);
      changeTitle(valid ? text : undefined);
    }, 300),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const descChangeHandler = useCallback(
    debounce((text: string) => {
      const valid = isValid(text, 0, 200);
      setDescInvalid(!valid);
      setDescription(valid ? text : undefined);
    }, 300),
    [setDescription]
  );

  const isValid = (t: string, min: number, max: number) =>
    t.length > min && t.length < max;

  const durationString = useMemo(() => {
    if (!totalLengthSecs) return "";
    const duration = intervalToDuration({
      start: 0,
      end: totalLengthSecs * 1000,
    });
    const hr = duration.hours ? duration.hours + "hr" : "";
    return `${hr} ${duration.minutes}m`;
  }, [totalLengthSecs]);

  return (
    <Box as={"header"} mb="2" position="relative" {...props}>
      <Text
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
        as={"div"}
      >
        <InputGroup colorScheme={titleInvalid ? "red" : "brand"} size={"lg"}>
          <InputLeftElement>
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost">
                  {(changedEmoji ?? emoji ?? "") || <FiFolder />}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                bg="transparent"
                border="none"
                ref={emojiMartRef}
              />
            </Popover>
          </InputLeftElement>
          <Input
            placeholder="Playlist Title"
            autoFocus
            defaultValue={rest}
            isInvalid={titleInvalid}
            onChange={(e) => titleChangeHandler(e.currentTarget.value)}
          />
          {titleInvalid && <InputRightAddon color="red" children="1~70" />}
        </InputGroup>
      </Text>
      <Text
        color={descColor}
        opacity={0.6}
        fontSize={{ base: "lg", md: "xl" }}
        as={"div"}
      >
        <InputGroup colorScheme={descInvalid ? "red" : "brand"}>
          <Input
            placeholder="Playlist Description"
            defaultValue={description}
            isInvalid={descInvalid}
            onChange={(e) => descChangeHandler(e.currentTarget.value)}
          />
          {descInvalid && <InputRightAddon color="red" children="0~200" />}
        </InputGroup>{" "}
        <Text color="bg.200" float="right" fontSize={"xl"}>
          {count > 0 ? `${count} songs` : ""}
          {durationString ? ` • ${durationString}` : ""}
        </Text>
      </Text>
    </Box>
  );
}
