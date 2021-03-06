import React, { useEffect } from "react";
import * as serviceWorker from "../../serviceWorkerRegistration";
import { Box, Text, CloseButton, HStack, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ServiceWorkerWrapper = () => {
  const { t } = useTranslation();
  const [showReload, setShowReload] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [waitingWorker, setWaitingWorker] =
    React.useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    if (!registration) return;
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.addUpdateHook(onSWUpdate);
  }, []);

  const reloadPage = () => {
    setShowReload(false);
    if (waitingWorker) {
      waitingWorker?.postMessage({ type: "SKIP_WAITING" });
      waitingWorker?.addEventListener("statechange", (e: any) => {
        if (e.target.state === "activated") {
          window.location.reload();
        }
      });
    }
  };

  return showReload && !dismissed ? (
    <Box
      position="absolute"
      top="env(safe-area-inset-top)"
      bgColor="brand.400"
      dropShadow={"dark-lg"}
      px={4}
      py={3}
      m={2}
      rounded="lg"
      zIndex={5}
    >
      <HStack>
        <Text>{t("Update available, please reload the page")}</Text>
        <Button
          size="sm"
          fontSize={"md"}
          onClick={reloadPage}
          color="white"
          bgColor="n2.400"
        >
          {t("Reload")}
        </Button>
        <CloseButton onClick={() => setDismissed(true)} />
      </HStack>
    </Box>
  ) : null;
};

export default ServiceWorkerWrapper;
