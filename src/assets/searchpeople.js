import * as React from "react";
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={17}
    height={18}
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_327_1876)">
      <Circle
        cx={7.79167}
        cy={8.29163}
        r={6.44548}
        transform="rotate(-45 7.79167 8.29163)"
        stroke="black"
        strokeWidth={1.13333}
      />
      <Path
        d="M12.7725 12.9996L15.9775 16.1296"
        stroke="black"
        strokeWidth={1.13333}
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_327_1876">
        <Rect
          width={17}
          height={17}
          fill="white"
          transform="translate(0 0.5)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
