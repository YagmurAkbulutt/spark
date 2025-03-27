import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={3}
    height={3}
    viewBox="0 0 3 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={1.5} cy={1.5} r={1.5} fill="#D134AA" />
  </Svg>
);
export default SVGComponent;
