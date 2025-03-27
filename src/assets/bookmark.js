import * as React from "react";
import Svg, { G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={31}
    height={35}
    viewBox="0 0 31 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_24_1157)">
      <G filter="url(#filter1_d_24_1157)">
        <Path
          d="M5.40039 6.14395V29.456L15.1124 22.656L24.8244 29.456V6.14395C24.8244 5.07195 23.9524 4.19995 22.8804 4.19995H7.34439C6.27239 4.19995 5.40039 5.07195 5.40039 6.14395Z"
          stroke="white"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
    <Defs></Defs>
  </Svg>
);
export default SVGComponent;
