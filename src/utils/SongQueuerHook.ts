import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useStoreActions } from "../store";

export function useSongQueuer() {
  const toast = useToast();
  const { t } = useTranslation();
  const queueSongs = useStoreActions((actions) => actions.playback.queueSongs);

  const cb = useCallback(
    async (toQueue: { songs: Song[]; immediatelyPlay: boolean }) => {
      const ct = await queueSongs(toQueue);
      toast({
        variant: "subtle",
        status: "success",
        description: `Added ${ct} to Queue`,
        position: "bottom-right",
      });
    },
    [toast, queueSongs]
  );

  return cb;
}
