import { useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStoreActions, useStoreState } from "../../store";
import { useServerOrgList } from "../../modules/services/statics.service";
import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiChevronDown, FiChevronUp, FiStar } from "react-icons/fi";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  animate,
  LayoutGroup,
  motion,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { MdDragHandle, MdDragIndicator } from "react-icons/md";
import { Org } from "../../store/org";

export default function OrgManager() {
  return (
    <Flex direction="column" flexWrap="wrap">
      <OrgPickerPanel></OrgPickerPanel>
    </Flex>
  );
}

export function OrgPickerPanel({
  pickOrg,
  ...rest
}: { pickOrg?: (org: Org | undefined) => void } & BoxProps) {
  const orglist = useStoreState((s) => s.org.orgsList);
  const setOrglist = useStoreActions((s) => s.org.setOrgsList);

  const { data: orgs, isLoading } = useServerOrgList();

  const [search, setSearch] = React.useState("");
  const handleChange = (event: any) => setSearch(event.target.value);

  // nan orgs:
  const nonfavs = useMemo(() => {
    return orgs?.filter((x) => !orglist.includes(x.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orglist.length, orgs]);

  const favOrg = (name: string) => {
    setOrglist([...orglist, name]);
  };
  const unfavOrg = (name: string) => {
    setOrglist([...orglist.filter((x) => x !== name)]);
  };

  return (
    <Box {...rest}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Search Orgs"
          value={search}
          onChange={handleChange}
        />
        <InputRightElement width="4.5rem">
          <CloseButton onClick={() => setSearch("")}></CloseButton>
        </InputRightElement>
      </InputGroup>
      <Box
        maxH="70vh"
        overflowY="auto"
        overflowX="hidden"
        minWidth="200px"
        maxWidth="450px"
        pr="2"
      >
        {/* <VStack> */}
        <Reorder.Group
          axis="y"
          values={orglist}
          onReorder={setOrglist}
          as="div"
          style={{ minWidth: "300px", maxWidth: "400px", width: "100%" }}
        >
          {orglist
            .filter((x) =>
              search ? x.toLowerCase().includes(search.toLowerCase()) : true
            )
            .map((org) => (
              <ReorderableOrgItem
                key={"order_" + org}
                {...{ org, unfavOrg, pickOrg, orgs }}
              />
            ))}
        </Reorder.Group>
        <Divider mt={2} />
        {nonfavs
          ?.filter((x) =>
            search ? x.name.toLowerCase().includes(search.toLowerCase()) : true
          )
          .map((org) => {
            return (
              <Flex
                width="100%"
                // is="div"
                mt={2}
                style={{ minWidth: "300px", maxWidth: "400px" }}
                key={"orgselect" + org.name}
                // value={org}
              >
                <IconButton
                  icon={<FaRegStar />}
                  aria-label="favorite"
                  variant="ghost"
                  onClick={() => {
                    favOrg(org.name);
                  }}
                ></IconButton>
                <Button
                  fontWeight="400"
                  flex="1"
                  variant="ghost"
                  onClick={() => {
                    pickOrg && pickOrg(org);
                  }}
                >
                  {org.name}
                </Button>
              </Flex>
            );
          })}
        {/* </VStack> */}
      </Box>
    </Box>
  );
}
function ReorderableOrgItem({
  org,
  unfavOrg,
  pickOrg,
  orgs,
}: {
  org: string;
  unfavOrg: (name: string) => void;
  pickOrg: ((org: Org | undefined) => void) | undefined;
  orgs: Org[] | undefined;
}): JSX.Element {
  const controls = useDragControls();
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={org}
      id={org}
      as="div"
      style={{
        boxShadow,
        y,
        display: "flex",
        marginTop: "0.5rem",
      }}
      dragListener={false}
      dragControls={controls}
    >
      <IconButton
        icon={<FaStar />}
        aria-label="favorite"
        variant="ghost"
        colorScheme="yellow"
        onClick={() => {
          unfavOrg(org);
        }}
      ></IconButton>
      <Button
        colorScheme="grey"
        fontWeight="400"
        flex="1"
        variant="ghost"
        marginRight="0.5rem"
        onClick={() => {
          pickOrg && pickOrg(orgs?.find((x) => x.name === org));
        }}
      >
        {org}
      </Button>
      <MdDragHandle
        size="30px"
        width="30px"
        style={{ marginRight: "0px" }}
        onPointerDown={(e) => controls.start(e)}
        cursor="move"
      ></MdDragHandle>
    </Reorder.Item>
  );
}

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
}
