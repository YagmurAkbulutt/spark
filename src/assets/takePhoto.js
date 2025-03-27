import * as React from "react";
import Svg, {
  Rect,
  ForeignObject,
  Circle,
  Defs,
  ClipPath,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: div */
const SVGComponent = (props) => (
  <Svg
    width={79}
    height={79}
    viewBox="0 0 79 79"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={1.23438}
      y={1.23438}
      width={76.5312}
      height={76.5312}
      rx={38.2656}
      stroke="white"
      strokeWidth={2.46875}
    />
    <ForeignObject
      x={-17.4531}
      y={-17.4531}
      width={113.906}
      height={113.906}
    ></ForeignObject>
    <Circle
      data-figma-bg-blur-radius={23.4531}
      cx={39.5}
      cy={39.5}
      r={33.5}
      fill="white"
      fillOpacity={0.6}
    />
    <Defs>
      <ClipPath
        id="bgblur_0_24_2553_clip_path"
        transform="translate(17.4531 17.4531)"
      >
        <Circle cx={39.5} cy={39.5} r={33.5} />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
