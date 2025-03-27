import * as React from "react";
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_159_1429)">
      <Circle
        cx={11}
        cy={11}
        r={8.3995}
        transform="rotate(-45 11 11)"
        stroke="black"
        strokeWidth={3}
      />
      <Path
        d="M18.0312 17.6465L22.556 22.0653"
        stroke="black"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_159_1429">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
