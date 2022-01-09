import { useInterval, useBoolean, HStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  useVisibleElements,
  useScroll,
  SnapList,
  SnapItem,
} from "react-snaplist-carousel";
import { useStoreState } from "../../store";
import { VideoPlaylistCard } from "./VideoPlaylistCard";

export function VideoPlaylistCarousel({
  videoPlaylists,
}: {
  videoPlaylists?: { playlist: PlaylistFull; video: any }[];
}) {
  const snapList = useRef(null);

  const visible = useVisibleElements(
    { debounce: 10, ref: snapList },
    ([element]) => element
  );
  const goToSnapItem = useScroll({ ref: snapList });

  const [currentItemAuto, setCurrentItemAuto] = useState(0);

  const currentlyPlayingPlaylistId = useStoreState(
    (store) => store.playback.currentPlaylist?.id
  );

  const playingFromIdx = useMemo(() => {
    return (
      videoPlaylists?.findIndex(
        (x) => x?.playlist?.id === currentlyPlayingPlaylistId
      ) || -1
    );
  }, [currentlyPlayingPlaylistId, videoPlaylists]);

  useInterval(() => {
    // Dont change if hovering on an item, or playing from an item
    if (
      !hovering &&
      (playingFromIdx < 0 || playingFromIdx !== currentItemAuto)
    ) {
      goToSnapItem((currentItemAuto + 1) % (videoPlaylists?.length || 1));
      setCurrentItemAuto(currentItemAuto + (1 % (videoPlaylists?.length || 1)));
    }
  }, 12000);

  useEffect(() => {
    setCurrentItemAuto(visible);
  }, [visible]);

  const [hovering, { on, off }] = useBoolean(false);

  if (!videoPlaylists) return null;

  return (
    <HStack spacing={0} onMouseEnter={on} onMouseLeave={off}>
      <CarouselNav>
        {videoPlaylists &&
          videoPlaylists.map((x, idx) => (
            <button
              key={"kbxn" + x?.video.id}
              className={
                currentItemAuto === idx
                  ? "cnav-button cnav-active"
                  : "cnav-button"
              }
              onClick={() => {
                goToSnapItem(idx);
                setCurrentItemAuto(idx);
              }}
            ></button>
          ))}
      </CarouselNav>

      <SnapList ref={snapList} direction="horizontal">
        {videoPlaylists &&
          videoPlaylists.map((x: any) => (
            <SnapItem
              key={"kxs" + x?.video.id}
              snapAlign="center"
              height="100%"
              width="100%"
            >
              <VideoPlaylistCard video={x?.video} playlist={x?.playlist} />
            </SnapItem>
          ))}
      </SnapList>
    </HStack>
  );
}

const CarouselNav = styled.aside`
  position: relative;
  margin-left: -24px;
  top: 0px;
  bottom: 0px;
  width: 20px;
  margin-right: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  z-index: 4;

  .cnav {
    display: block;
  }

  .cnav-button {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #333;
    background-clip: content-box;
    border: 0.25rem solid transparent;
    border-radius: 0.75rem;
    font-size: 0;
    transition: all 0.4s;
  }

  .cnav-button.cnav-active {
    background-color: var(--chakra-colors-n2-400);
    height: 2rem;
  }
`;
