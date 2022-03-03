import React, { useEffect } from "react";
import * as serviceWorker from "../../serviceWorkerRegistration";
import { useToast } from "@chakra-ui/react";

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = React.useState(false);
  const [waitingWorker, setWaitingWorker] =
    React.useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    if (!registration) return;
    setShowReload(true);
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    setWaitingWorker(registration.waiting);
  };
  const toast = useToast();

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    setShowReload(false);
    window.location.reload();
  };

  useEffect(() => {
    if (showReload) {
      toast({
        title: "Update available, please refresh the page",
        status: "info",
        position: "top-left",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [showReload, toast]);

  return null;
};

export default ServiceWorkerWrapper;
