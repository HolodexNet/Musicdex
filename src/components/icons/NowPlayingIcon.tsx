import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CSSProperties } from "react";

interface NowPlayingIconProps {
  style: CSSProperties;
  isPlaying: boolean;
}

export function NowPlayingIcon(props: NowPlayingIconProps) {
  return (
    <NowPlayingIconContainer {...props}>
      <span />
      <span />
      <span />
    </NowPlayingIconContainer>
  );
}

const NowPlayingIconContainer = styled.div`
  display: flex;
  height: 0.9em;
  justify-content: start;
  align-items: flex-end;

  > span {
    width: 0.24em;
    height: 100%;
    margin-right: 1px;
    transform: scaleY(
      ${({ isPlaying }: NowPlayingIconProps) => (isPlaying ? `0` : `0.1`)}
    );

    background-color: currentColor;
    transform-origin: center;

    ${({ isPlaying }: NowPlayingIconProps) =>
      isPlaying &&
      css`
        &:nth-of-type(1) {
          animation: ease-out now-playing-bounce-1 1202ms 13ms infinite;
        }

        &:nth-of-type(2) {
          animation: ease-out now-playing-bounce-2 1502ms infinite;
        }

        &:nth-of-type(3) {
          animation: ease-out now-playing-bounce-3 902ms infinite;
        }
      `}
  }

  @keyframes now-playing-bounce-1 {
    from,
    to {
      transform: scaleY(0.25);
    }
    20% {
      transform: scaleY(0.45);
    }
    40% {
      transform: scaleY(0.22);
    }
    60% {
      transform: scaleY(0.82);
    }
    80% {
      transform: scaleY(0.44);
    }
  }
  @keyframes now-playing-bounce-2 {
    from,
    to {
      transform: scaleY(0.13);
    }
    20% {
      transform: scaleY(0.3);
    }
    40% {
      transform: scaleY(0.4);
    }
    60% {
      transform: scaleY(0.44);
    }
    80% {
      transform: scaleY(0.71);
    }
  }
  @keyframes now-playing-bounce-3 {
    from,
    to {
      transform: scaleY(0.48);
    }
    20% {
      transform: scaleY(0.68);
    }
    40% {
      transform: scaleY(0.53);
    }
    60% {
      transform: scaleY(0.71);
    }
    80% {
      transform: scaleY(0.35);
    }
  }
`;
