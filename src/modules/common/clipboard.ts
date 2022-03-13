import { useToast } from "@chakra-ui/react";

export const useClipboardWithToast = () => {
  const toast = useToast();
  return (text: string, silent?: boolean) => {
    navigator.clipboard.writeText(text);
    if (silent) return;
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 1500,
      position: "top-right",
    });
  };
};
