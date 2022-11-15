import { Box, Text, CloseButton, HStack, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

const SW_UPDATE_INTERVAL = 15 * 60 * 1000;

const ServiceWorkerWrapper = () => {
  const { t } = useTranslation();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
      r &&
        setInterval(() => {
          r.update();
        }, SW_UPDATE_INTERVAL);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  return needRefresh ? (
    <Box
      position="absolute"
      top="env(safe-area-inset-top)"
      bgColor="brand.400"
      shadow="dark-lg"
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
          onClick={() => updateServiceWorker(true)}
          color="white"
          bgColor="n2.400"
        >
          {t("Reload")}
        </Button>
        <CloseButton onClick={() => setNeedRefresh(false)} />
      </HStack>
    </Box>
  ) : null;
};

export default ServiceWorkerWrapper;
