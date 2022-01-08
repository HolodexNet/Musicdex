import { Icon, IconProps } from "@chakra-ui/react";

export function LineLogo(props: IconProps) {
  return (
    <Icon {...props}>
      <g
        xmlns="http://www.w3.org/2000/svg"
        style={{
          mixBlendMode: "color-dodge",
        }}
        fill="white"
      >
        <path d="M4.6 18.8V4.2l1.3.8v13l-1.3.8Z" />
        <path d="M5.4 22.6a2 2 0 0 0 2.2 0L23 13.3a2 2 0 0 0 0-3.4L7.6.3a2 2 0 0 0-2.2.1l13.7 8.4.3.2 3 1.8c.5.3.5 1 0 1.4l-3 1.8-.3.2-13.7 8.4Z" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.3 2v19c0 .6.6 1 1.1.6l15.4-9.4c.5-.3.5-1 0-1.4L2.4 1.4a.8.8 0 0 0-1.1.6ZM0 2v19a2 2 0 0 0 3 1.7l15.5-9.5a2 2 0 0 0 0-3.4L3.1.3A2 2 0 0 0 0 2Z"
        />
      </g>
    </Icon>
  );
}
