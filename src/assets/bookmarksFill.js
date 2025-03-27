import * as React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={19}
    height={20}
    viewBox="0 0 19 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect y={0.963867} width={18.4482} height={18.4482} rx={3} fill="black" />
    <G clipPath="url(#clip0_24_1513)">
      <Path
        d="M5.78223 6.12068V14L9.06482 11.7016L12.3474 14V6.12068C12.3474 5.75835 12.0527 5.46362 11.6904 5.46362H6.43929C6.07696 5.46362 5.78223 5.75835 5.78223 6.12068Z"
        fill="white"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_24_1513">
        <Rect
          width={8.07144}
          height={10.3065}
          fill="white"
          transform="translate(5.03125 5.15662)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
