import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M10.3845 16.8558L4.20452 11.1384C0.836961 7.75235 5.74952 1.19302 10.3845 6.49877C15.0195 1.21152 19.9784 7.76623 16.5645 11.1384L10.3845 16.8605V16.8558Z"
      stroke="#9D9C9C"
      strokeWidth={1.48024}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
