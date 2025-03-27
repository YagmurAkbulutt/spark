import * as React from "react";
import Svg, { G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={36}
    height={31}
    viewBox="0 0 36 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_24_1137)">
      <Path
        d="M17.7691 25.7117L5.40903 14.2768C-1.32608 7.5047 8.49904 -5.61397 17.7691 4.99753C27.0391 -5.57696 36.9567 7.53245 30.1291 14.2768L17.7691 25.7209V25.7117Z"
        stroke="white"
        strokeWidth={1.48024}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SVGComponent;
