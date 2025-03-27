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
    <Rect
      x={0.0488281}
      y={0.963867}
      width={18.4482}
      height={18.4482}
      rx={3}
      fill="black"
    />
    <G clipPath="url(#clip0_24_1508)">
      <Path
        d="M6.25 6.12068V14L9.5326 11.7016L12.8152 14V6.12068C12.8152 5.75835 12.5205 5.46362 12.1581 5.46362H6.90706C6.54473 5.46362 6.25 5.75835 6.25 6.12068Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_24_1508">
        <Rect
          width={8.07144}
          height={10.3065}
          fill="white"
          transform="translate(5.49902 5.15662)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
