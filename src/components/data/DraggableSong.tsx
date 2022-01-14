import { useStoreActions } from "../../store";

export function useDraggableSong(song: Song) {
  const setDragging = useStoreActions((a) => a.dnd.setDragging);

  const onDragStart = (e: any) => {
    // console.log(e);
    e.dataTransfer.setData(
      "text/plain",
      `${window.location.origin}/song/${song.id}`
    );
    e.dataTransfer.setData(
      "text/uri-list",
      `${window.location.origin}/song/${song.id}`
    );
    e.dataTransfer.setData("song", JSON.stringify(song));
    setDragging(true);
  };

  const onDragEnd = (e: any) => {
    setDragging(false);
  };

  return { draggable: true, onDragStart, onDragEnd };
}
