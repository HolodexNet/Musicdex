import { fabric } from "fabric";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { getSongArtwork } from "../../utils/SongHelper";

interface PipDrawerProps {
  isPlaying: boolean;
  progress: number;
  totalDuration: number;
}

export function PipDrawer({
  isPlaying,
  progress,
  totalDuration,
}: PipDrawerProps) {
  const [canvas, setCanvas] = useState<fabric.StaticCanvas | undefined>();

  const pictureInPicture = useStoreState(
    (state) => state.player.pictureInPicture
  );
  const setPictureInPicture = useStoreActions(
    (store) => store.player.setPictureInPicture
  );

  const { canvasElement, videoElement } = useMemo(() => {
    setCanvas(undefined);

    const canvasElement = document.createElement("canvas");
    canvasElement.width = 400;
    canvasElement.height = 120;

    // https://bugzilla.mozilla.org/show_bug.cgi?id=1572422#c7
    // doesn't work unless you call a getContext on firefox LMAO
    canvasElement.getContext("2d");

    const videoElement = document.createElement("video");
    videoElement.srcObject = canvasElement.captureStream();
    videoElement.muted = true;
    videoElement.play();

    return { canvasElement, videoElement };
  }, []);

  useEffect(() => {
    const leavepictureinpictureHandler = () => {
      setPictureInPicture(false);
    };
    videoElement.addEventListener(
      "leavepictureinpicture",
      leavepictureinpictureHandler
    );
    return () => {
      videoElement.removeEventListener(
        "leavepictureinpicture",
        leavepictureinpictureHandler
      );
    };
  }, [videoElement, setPictureInPicture]);

  useEffect(() => {
    if (pictureInPicture) {
      if (document.pictureInPictureEnabled) {
        // videoElement.play();
        videoElement.requestPictureInPicture();
      } else {
        videoElement.play();
        (videoElement as any)?.webkitSetPresentationMode?.(
          "picture-in-picture"
        );
      }
    }
  }, [videoElement, pictureInPicture]);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const canvas = new fabric.StaticCanvas(canvasElement, {
      backgroundColor: style.getPropertyValue("--chakra-colors-gray-800"),
    });
    setCanvas(canvas);

    const gradient = new fabric.Gradient({
      type: "linear",
      gradientUnits: "pixels",
      coords: { x1: 0, y1: 0, x2: 0, y2: canvasElement.height },
      colorStops: [
        {
          offset: 0,
          color: style.getPropertyValue("--chakra-colors-brand-300"),
        },
        {
          offset: 1,
          color: style.getPropertyValue("--chakra-colors-n2-300"),
        },
      ],
    });
    const background = new fabric.Rect({
      width: canvasElement.width,
      height: canvasElement.height,
      opacity: 0.25,
    });
    background.set("fill", gradient);
    canvas.add(background);

    return () => {
      canvas.dispose();
      setCanvas(undefined);
    };
  }, [canvasElement]);

  // Current song
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );

  useEffect(() => {
    if (canvas && currentSong) {
      const style = getComputedStyle(document.documentElement);
      let objs: fabric.Object[] = [];

      fabric.Image.fromURL(
        // getSongArtwork(currentSong, 100),
        currentSong.art ??
          `https://holodex.net/statics/channelImg/${currentSong.channel_id}/100.png`,
        (img) => {
          img.scaleToWidth(100);
          img.set({
            top: 10,
            left: 10,
          });
          canvas.add(img);
          objs.push(img);
        },
        {
          crossOrigin: "anonymous",
        }
      );

      var title = new fabric.Text(currentSong.name, {
        left: 120,
        top: 30,
        originY: "center",
        fill: "rgba(255,255,255,0.92)",
        fontSize: 20,
        fontFamily: style.getPropertyValue("--chakra-fonts-body"),
      });
      canvas.add(title);
      objs.push(title);

      var channel = new fabric.Text(currentSong.channel.name, {
        left: 120,
        top: 60,
        originY: "center",
        fill: "rgba(255,255,255,0.92)",
        fontSize: 20,
        fontFamily: style.getPropertyValue("--chakra-fonts-body"),
        opacity: 0.66,
      });
      canvas.add(channel);
      objs.push(channel);

      videoElement.play();

      // if ("mediaSession" in navigator) {
      //   navigator.mediaSession.metadata = new MediaMetadata({
      //     title: currentSong.name,
      //     artist: currentSong.channel.name,
      //     artwork: [{ src: getSongArtwork(currentSong) }],
      //   });
      // }

      return () => {
        canvas.remove(...objs);
      };
    }
  }, [videoElement, canvas, currentSong]);

  const updatePlaying = useDebounce(
    (isPlaying: boolean) => {
      console.log(`isPlaying=${isPlaying}`);
      if (isPlaying) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    },
    1000,
    [videoElement]
  );

  useEffect(() => {
    updatePlaying(isPlaying);
  }, [updatePlaying, isPlaying]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      if (!currentSong) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
        return;
      }
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.name,
        artist: currentSong.channel.name,
        artwork: [{ src: getSongArtwork(currentSong) }],
      });
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [currentSong, isPlaying, pictureInPicture]);

  // useEffect(() => {
  //   if ("mediaSession" in navigator) {
  //     navigator.mediaSession.setPositionState({
  //       duration: totalDuration,
  //       playbackRate: 1,
  //       position: (progress / 100) * totalDuration,
  //     });
  //   }
  // }, [progress, totalDuration]);

  return <></>;
}

function useDebounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number,
  dep: React.DependencyList = []
) {
  const { current } = useRef<{
    fn: any;
    timer: any;
  }>({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn]
  );

  return useCallback(function f(...args: T) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn(...args);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dep);
}
