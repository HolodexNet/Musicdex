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

      // immediate play doens't need feedback
      if (toQueue.immediatelyPlay) return;
      toast({
        variant: "subtle",
        status: "success",
        description: t("Added {{amount}} to Queue", { amount: ct }),
        position: "bottom-right",
        duration: 1500,
      });
    },
    [toast, queueSongs, t]
  );

  return cb;
}
