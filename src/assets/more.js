import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={10}
    height={3}
    viewBox="0 0 10 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle
      cx={1.08862}
      cy={1.08862}
      r={1.08862}
      transform="matrix(-1 0 0 1 2.63281 0)"
      fill="black"
    />
    <Circle
      cx={1.08862}
      cy={1.08862}
      r={1.08862}
      transform="matrix(-1 0 0 1 6.31641 0)"
      fill="black"
    />
    <Circle
      cx={1.08862}
      cy={1.08862}
      r={1.08862}
      transform="matrix(-1 0 0 1 10 0)"
      fill="black"
    />
  </Svg>
);
export default SVGComponent;
