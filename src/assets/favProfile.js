import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={27}
    viewBox="0 0 24 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_24_2268)">
      <Path
        d="M12.0299 20.9929L2.53028 12.2043C-2.64618 6.99937 4.9052 -3.08336 12.0299 5.07242C19.1547 -3.05491 26.7772 7.0207 21.5296 12.2043L12.0299 21V20.9929Z"
        stroke="#9D9C9C"
        strokeWidth={1.48024}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_24_2268">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
