import { Icon, IconProps } from "@chakra-ui/react";
import uniqueId from "lodash/uniqueId";
import { useRef } from "react";

export function GradientLogo(props: IconProps) {
  const { current: idx } = useRef(uniqueId("iid-"));
  return (
    <Icon {...props}>
      <g>
        <path
          d="M4.5 2a2 2 0 0 1 3-1.7L23 9.6a2 2 0 0 1 0 3.5L7.6 22.4a2 2 0 0 1-3-1.7V2Z"
          fill={`url(#a-${idx})`}
        />
        <path
          d="M0 2A2 2 0 0 1 3 .3l15.5 9.3a2 2 0 0 1 0 3.5L3.1 22.4A2 2 0 0 1 0 20.7V2Z"
          fill={`url(#b-${idx})`}
        />
      </g>
      <defs>
        <linearGradient
          id={"a-" + idx}
          x1=".2"
          y1="2.8"
          x2="19.3"
          y2="18.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F06292" />
          <stop offset="1" stopColor="#FF3A81" />
        </linearGradient>
        <linearGradient
          id={"b-" + idx}
          x1="-4.4"
          y1="2.8"
          x2="19.5"
          y2="11.3"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5DA2F2" />
          <stop offset="1" stopColor="#715BF7" stopOpacity=".8" />
        </linearGradient>
      </defs>
    </Icon>
  );
}
