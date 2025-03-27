import * as React from "react";
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_79_1172)">
      <Circle
        cx={11.1519}
        cy={11}
        r={9.09949}
        transform="rotate(-45 11.1519 11)"
        stroke="black"
        strokeWidth={1.6}
      />
      <Path
        d="M18.1831 17.6465L22.7079 22.0653"
        stroke="black"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_79_1172">
        <Rect
          width={24}
          height={24}
          fill="white"
          transform="translate(0.151855)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
