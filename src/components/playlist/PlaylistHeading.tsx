import {
  useColorModeValue,
  Box,
  Heading,
  Input,
  IconButton,
  Text,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useState, FormEventHandler } from "react";
import { FiEdit3 } from "react-icons/fi";

type PlaylistHeadingProps = {
  title: string;
  description: string;
  canEdit: boolean;
  editMode?: boolean;
  setTitle?: (text: string) => void;
  setDescription?: (text: string) => void;
  count: number;
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
  max = 500,
}: PlaylistHeadingProps) {
  const colors = useColorModeValue("gray.700", "gray.400");

  const [editTitle, setEditTitle] = useState(() => canEdit && editMode);
  const [editDescription, setEditDescription] = useState(
    () => canEdit && editMode
  );
  const [descInvalid, setDescInvalid] = useState(false);
  const [titleInvalid, setTitleInvalid] = useState(false);

  const submitHandlerTitle: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setEditTitle(false);
    if (setTitle && !titleInvalid)
      setTitle((e.target as any)[0].value as string);
  };
  const submitHandlerDesc: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setEditDescription(false);
    if (setDescription && !titleInvalid)
      setDescription((e.target as any)[0].value as string);
  };

  const isValid = (t: string, min: number, max: number) =>
    t.length > min && t.length < max;

  console.log(count);

  return (
    <Box as={"header"} mb="2" position="relative">
      <Heading
        lineHeight={1.1}
        fontWeight={500}
        fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "5xl" }}
      >
        {editTitle ? (
          <form onSubmit={submitHandlerTitle}>
            <InputGroup
              colorScheme={titleInvalid ? "red" : "brand"}
              size={"lg"}
            >
              <Input
                placeholder="Playlist Title"
                autoFocus
                isInvalid={titleInvalid}
                defaultValue={title}
                onChange={(e) =>
                  setTitleInvalid(!isValid(e.currentTarget.value, 1, 70))
                }
                enterKeyHint="done"
              />
              {titleInvalid && <InputRightAddon color="red" children="1~70" />}
            </InputGroup>
          </form>
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
      </Heading>
      <Text
        color={colors}
        fontWeight={300}
        fontSize={{ base: "1xl", sm: "1.5xl", md: "2xl", lg: "2xl" }}
        as={"div"}
      >
        {editDescription ? (
          <form onSubmit={submitHandlerDesc}>
            <InputGroup colorScheme={descInvalid ? "red" : "brand"}>
              <Input
                placeholder="Playlist Description"
                defaultValue={description}
                autoFocus
                isInvalid={descInvalid}
                enterKeyHint="done"
                onChange={(e) =>
                  setDescInvalid(!isValid(e.currentTarget.value, 0, 200))
                }
              />
              {descInvalid && <InputRightAddon color="red" children="0~200" />}
            </InputGroup>
          </form>
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
        <Text color="bg.400" float="right">
          {count > 0 ? count : ""}
          {count > 0 && max > 0 ? `/ ${max}` : ""}
        </Text>
      </Text>
    </Box>
  );
}
