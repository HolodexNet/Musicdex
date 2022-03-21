import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const useClipboardWithToast = () => {
  const toast = useToast();
  const { t } = useTranslation();
  return (text: string, silent?: boolean) => {
    navigator.clipboard.writeText(text);
    if (silent) return;
    toast({
      title: t("Copied to clipboard"),
      status: "success",
      duration: 1500,
      position: "top-right",
    });
  };
};
