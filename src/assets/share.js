import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={32}
    height={28}
    viewBox="0 0 32 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_24_1163)" filter="url(#filter0_d_24_1163)">
      <Path
        d="M3.54283 22.9681C9.21483 18.1121 10.6148 16.1681 16.1748 16.1681H19.0868V22.0001L28.7988 11.3121L19.0868 1.6001V7.4321H17.1428C7.43083 7.4321 5.48683 17.1441 3.54283 22.9761V22.9681Z"
        stroke="white"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_24_1163">
        <Rect
          width={26.856}
          height={22.968}
          fill="white"
          transform="matrix(-1 0 0 1 29.5996 0.800049)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
