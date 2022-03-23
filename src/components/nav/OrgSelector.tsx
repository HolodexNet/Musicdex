import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useServerOrgList } from "../../modules/services/statics.service";
import { useStoreActions, useStoreState } from "../../store";
import { Org } from "../../store/org";
import { MotionBox } from "../common/MotionBox";
import { OrgPickerPanel } from "../settings/OrgManagement";

export function OrgSelector() {
  const org = useStoreState((state) => state.org.currentOrg);
  const setOrg = useStoreActions((state) => state.org.setOrg);
  const orglist = useStoreState((s) => s.org.orgsList);

  const { data: orgs } = useServerOrgList();

  const usableOrgs = useMemo(() => {
    return orglist
      ? [
          ...(orglist
            .map((x) => Array.isArray(orgs) && orgs?.find((o) => o.name === x))
            .filter((x) => !!x) as Org[]),
          { name: "... Other Orgs" },
          ...(orglist.includes(org.name) ? [] : [org]),
        ]
      : [{ name: "... Other Orgs" }, ...[org]];
  }, [org, orglist, orgs]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <MotionBox
        opacity={0}
        animate={{
          scale: [0.9, 1],
          opacity: [0, 1],
          marginTop: ["-30px", "0px"],
        }}
        exit={{ opacity: 0, height: "0px" }}
        transition={{ duration: 0.4, type: "tween" }}
        px={2}
        mb={1}
      >
        <Select
          value={org.name}
          onChange={(e) => {
            const tgt = orgs?.find((x) => x.name === e.target.value);
            if (tgt) setOrg(tgt);
            else onOpen();
          }}
        >
          {usableOrgs?.map((x) => {
            return (
              <option key={x.name + "opt_os"} value={x.name}>
                {x.name}
              </option>
            );
          })}
        </Select>
      </MotionBox>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          minWidth="400px"
          maxWidth="100vw"
          maxH="70vh"
          overflowY="auto"
          overflowX="hidden"
          width="auto"
          backgroundColor="gray.900"
        >
          <ModalHeader>Select an org:</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="auto">
            <OrgPickerPanel
              pickOrg={(org) => {
                org && setOrg(org);
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
