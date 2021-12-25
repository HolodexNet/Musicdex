import {
  useColorModeValue,
  Box,
  Heading,
  Input,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useState, FormEventHandler } from "react";
import { FiEdit3 } from "react-icons/fi";

type PlaylistHeadingProps = {
  title: string;
  description: string;
  canEdit: boolean;
  editMode: boolean;
  setTitle?: (text: string) => {};
  setDescription?: (text: string) => {};
};

export function PlaylistHeading({
  title,
  description,
  canEdit,
  editMode,
  setTitle,
  setDescription,
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

  return (
    <Box as={"header"} mb="2" position="relative">
      <Heading
        lineHeight={1.1}
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
      >
        {editTitle ? (
          <form onSubmit={submitHandlerTitle}>
            <Input
              placeholder="Playlist Title"
              size="lg"
              autoFocus
              isInvalid={titleInvalid}
              defaultValue={title}
              onChange={(e) =>
                setTitleInvalid(!isValid(e.currentTarget.value, 5, 70))
              }
              enterKeyHint="done"
            />
          </form>
        ) : (
          title
        )}
        <IconButton
          display={!editTitle && canEdit ? "inline-block" : "none"}
          onClick={() => {
            setEditTitle(true);
          }}
          aria-label="edit title"
          variant="link"
          icon={<FiEdit3 />}
        ></IconButton>
      </Heading>
      <Text color={colors} fontWeight={300} fontSize={"2xl"}>
        {editDescription ? (
          <form onSubmit={submitHandlerDesc}>
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
          </form>
        ) : (
          description
        )}
        <IconButton
          display={!editDescription && canEdit ? "inline-block" : "none"}
          onClick={() => {
            setEditDescription(true);
          }}
          aria-label="edit title"
          variant="link"
          icon={<FiEdit3 />}
        ></IconButton>
      </Text>
    </Box>
  );
}
