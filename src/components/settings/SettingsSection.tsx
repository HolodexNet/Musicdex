import { Wrap, Flex, Heading, Divider } from "@chakra-ui/react";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Wrap
        justify="flex-end"
        spacingX={4}
        spacingY={8}
        my={8}
        justifyContent="center"
        minH={100}
      >
        <Heading flexGrow={1} mb={2} size={"md"}>
          {title}
        </Heading>
        <Flex
          flexBasis={400}
          justifyContent="center"
          alignItems={["center", "start"]}
          flexDirection={"column"}
        >
          {children}
        </Flex>
      </Wrap>
      <Divider />
    </>
  );
}
