import { Flex, Heading, Divider } from "@chakra-ui/react";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Flex flexWrap="wrap" my={6} justifyContent="center" minH={100}>
        <Flex flexBasis={200} flexGrow={1} mb={2}>
          <Heading size={"md"}>{title}</Heading>
        </Flex>
        <Flex
          flexBasis={400}
          justifyContent="center"
          alignItems={["center", "start"]}
          flexDirection={"column"}
        >
          {children}
        </Flex>
      </Flex>
      <Divider />
    </>
  );
}
