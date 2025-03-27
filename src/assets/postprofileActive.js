import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={28}
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={22} height={22} transform="translate(1 1)" fill="white" />
    <Rect
      x={1.75}
      y={1.75}
      width={8.5}
      height={20.5}
      rx={1.25}
      stroke="black"
      strokeWidth={1.5}
    />
    <Rect
      x={13.75}
      y={1.75}
      width={8.5}
      height={20.5}
      rx={1.25}
      stroke="black"
      strokeWidth={1.5}
    />
    <Path
      d="M6.5 27L17.5 27"
      stroke="black"
      strokeWidth={1.58824}
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
