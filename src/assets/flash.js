import * as React from "react";
import Svg, { G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_24_2557)">
      <Path
        d="M23.7812 6.0642L9 23.4626H17.6286L15.5045 34.5841C15.5004 34.606 15.5015 34.6284 15.5075 34.6497C15.5135 34.6711 15.5244 34.691 15.5394 34.708C15.5544 34.7249 15.5731 34.7386 15.5942 34.7479C15.6153 34.7572 15.6383 34.762 15.6615 34.762C15.6863 34.7619 15.7107 34.7564 15.7328 34.7458C15.7549 34.7352 15.7742 34.7199 15.7889 34.701L30.5715 17.2993H21.9429L24.0771 6.17655C24.08 6.15439 24.0779 6.13191 24.0709 6.11059C24.0639 6.08927 24.0523 6.0696 24.0367 6.0529C24.0212 6.0362 24.0021 6.02284 23.9807 6.01372C23.9593 6.0046 23.9361 5.99992 23.9126 6C23.887 6.0001 23.8617 6.00596 23.8388 6.01712C23.816 6.02827 23.7962 6.04441 23.7812 6.0642Z"
        stroke="white"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        shapeRendering="crispEdges"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SVGComponent;
