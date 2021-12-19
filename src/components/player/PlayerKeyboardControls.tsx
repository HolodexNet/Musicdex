import { useCallback, useEffect } from "react";

export function useKeyboardEvents(
  callback: (event: KeyboardEvent) => void,
  deps: React.DependencyList = []
) {
  const onKeyPressed = useCallback(
    (event: KeyboardEvent) => {
      callback(event);
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyPressed);
    return () => document.removeEventListener("keydown", onKeyPressed);
  }, [deps, onKeyPressed]);
}
