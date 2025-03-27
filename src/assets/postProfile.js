import * as React from "react";
import Svg, { Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={27}
    viewBox="0 0 24 27"
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
      stroke="#9D9C9C"
      strokeWidth={1.5}
    />
    <Rect
      x={13.75}
      y={1.75}
      width={8.5}
      height={20.5}
      rx={1.25}
      stroke="#9D9C9C"
      strokeWidth={1.5}
    />
  </Svg>
);
export default SVGComponent;
