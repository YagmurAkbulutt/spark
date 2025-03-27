import * as React from "react";
import Svg, { Rect, G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={64}
    height={64}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={64} height={64} rx={32} fill="black" />
    <G filter="url(#filter0_d_224_3555)">
      <Path
        d="M18.8936 43.122C24.7565 37.8397 26.2037 35.7251 31.9509 35.7251H34.961V42.069L45 30.4428L34.961 19.8782V26.2221H32.9515C22.9125 26.2221 20.903 36.7867 18.8936 43.1307V43.122Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SVGComponent;
