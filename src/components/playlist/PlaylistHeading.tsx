import {
  useColorModeValue,
  Box,
  Input,
  IconButton,
  Text,
  InputGroup,
  InputRightAddon,
  BoxProps,
} from "@chakra-ui/react";
import { intervalToDuration } from "date-fns";
import { useState, useMemo, useEffect, useCallback } from "react";
import { FiEdit3 } from "react-icons/fi";

type PlaylistHeadingProps = {
  title: string;
  description: string;
  canEdit: boolean;
  editMode?: boolean;
  setTitle?: (text: string | undefined) => void;
  setDescription?: (text: string | undefined) => void;
  count: number;
  totalLengthSecs?: number;
  max?: number;
};

export function PlaylistHeading({
  title,
  description,
  canEdit,
  editMode = false,
  setTitle,
  setDescription,
  count,
  totalLengthSecs,
  max = 500,
  ...props
}: PlaylistHeadingProps & BoxProps) {
  const descColor = useColorModeValue("gray.800", "gray.200");

  const [editTitle, setEditTitle] = useState(() => canEdit && editMode);
  const [editDescription, setEditDescription] = useState(
    () => canEdit && editMode
  );
  const [descInvalid, setDescInvalid] = useState(false);
  const [titleInvalid, setTitleInvalid] = useState(false);

  useEffect(() => {
    setEditTitle(canEdit && editMode);
    setEditDescription(canEdit && editMode);
    setTitleInvalid(false);
    setDescInvalid(false);
  }, [canEdit, editMode]);

  const titleChangeHandler = useCallback(
    (text: string) => {
      const valid = isValid(text, 1, 70);
      setTitleInvalid(!valid);
      if (setTitle) {
        setTitle(valid ? text : undefined);
      }
    },
    [setTitle]
  );

  const descChangeHandler = useCallback(
    (text: string) => {
      const valid = isValid(text, 0, 200);
      setDescInvalid(!valid);
      if (setDescription) {
        setDescription(valid ? text : undefined);
      }
    },
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
      >
        {editTitle ? (
          <InputGroup colorScheme={titleInvalid ? "red" : "brand"} size={"lg"}>
            <Input
              placeholder="Playlist Title"
              autoFocus
              isInvalid={titleInvalid}
              defaultValue={title}
              onChange={(e) => titleChangeHandler(e.currentTarget.value)}
              enterKeyHint="done"
            />
            {titleInvalid && <InputRightAddon color="red" children="1~70" />}
          </InputGroup>
        ) : (
          title
        )}
        <IconButton
          display={!editTitle && canEdit ? "inline-block" : "none"}
          onClick={() => {
            setEditTitle(true);
          }}
          ml={2}
          size="lg"
          verticalAlign="baseline"
          aria-label="edit title"
          variant="link"
          icon={<FiEdit3 />}
        ></IconButton>
      </Text>
      <Text
        color={descColor}
        opacity={0.6}
        fontSize={{ base: "lg", md: "xl" }}
        as={"div"}
      >
        {editDescription ? (
          <InputGroup colorScheme={descInvalid ? "red" : "brand"}>
            <Input
              placeholder="Playlist Description"
              defaultValue={description}
              autoFocus
              isInvalid={descInvalid}
              enterKeyHint="done"
              onChange={(e) => descChangeHandler(e.currentTarget.value)}
            />
            {descInvalid && <InputRightAddon color="red" children="0~200" />}
          </InputGroup>
        ) : (
          <span>{description}</span>
        )}
        <IconButton
          display={!editDescription && canEdit ? "inline" : "none"}
          verticalAlign="middle"
          onClick={() => {
            setEditDescription(true);
          }}
          ml={2}
          aria-label="edit title"
          variant="link"
          icon={<FiEdit3 />}
        ></IconButton>{" "}
        <Text color="bg.200" float="right" fontSize={"xl"}>
          {count > 0 ? `${count} songs` : ""}
          {durationString ? ` • ${durationString}` : ""}
        </Text>
      </Text>
    </Box>
  );
}
