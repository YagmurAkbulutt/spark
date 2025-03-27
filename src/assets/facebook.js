import * as React from "react";
import Svg, {
  G,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";
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
    <G clipPath="url(#clip0_220_2645)">
      <Rect width={64} height={64} rx={32} fill="black" />
      <Rect
        x={-5}
        y={-5}
        width={73.7991}
        height={73.7991}
        rx={30}
        fill="url(#paint0_linear_220_2645)"
      />
      <G filter="url(#filter0_i_220_2645)">
        <Path
          d="M41.8384 34.7484L43.0715 26.7891H35.4755V21.6156C35.4755 19.4392 36.536 17.3126 39.9271 17.3126H43.4291V10.5348C41.3897 10.2044 39.3289 10.0256 37.2635 10C31.0117 10 26.9301 13.818 26.9301 20.7202V26.7891H20V34.7484H26.9301V54H35.4755V34.7484H41.8384Z"
          fill="white"
        />
      </G>
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_220_2645"
        x1={31.8996}
        y1={66.6429}
        x2={31.8996}
        y2={-5}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#0062E0" />
        <Stop offset={1} stopColor="#19AFFF" />
      </LinearGradient>
      <ClipPath id="clip0_220_2645">
        <Rect width={64} height={64} rx={32} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
