import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.88453 16.8558L3.70452 11.1384C0.336961 7.75235 5.24952 1.19302 9.88453 6.49877C14.5195 1.21152 19.4784 7.76623 16.0645 11.1384L9.88453 16.8605V16.8558Z"
      fill="#D134AA"
      stroke="#D134AA"
      strokeWidth={1.48024}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
