import styled from "@emotion/styled";

export const BGImgContainer = styled.div<{ height: string }>`
  width: 100%;
  position: absolute;
  z-index: 0;
  pointer-events: none;
  left: 0px;
  top: 0px;
  height: ${({ height }) => height};
  mask-image: radial-gradient(
    ellipse farthest-side at 33% 12%,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.63) 48%,
    rgba(0, 0, 0, 0.58) 74%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-size: 150% 132%;
  mask-position: left bottom;
`;
export const BGImg = styled.div<{
  banner_url: string;
  height: string;
  blur?: boolean;
}>`
  width: 100%;
  position: absolute;
  pointer-events: none;
  z-index: 0;
  left: 0px;
  top: 0px;
  height: ${({ height }) => height};
  background: url(${({ banner_url }) => banner_url});
  background-position: center;
  background-size: cover;
  ${(blur) => blur && "filter: blur(8px);"}
`;
