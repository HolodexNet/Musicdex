import { useCallback } from "react";
import { useStoreState } from "../../store";

export default function useNamePicker() {
  const useEN = useStoreState((s) => s.settings.useEN);
  return useCallback(
    (en, jp) => {
      return useEN ? en || jp : jp || en;
    },
    [useEN]
  );
}
