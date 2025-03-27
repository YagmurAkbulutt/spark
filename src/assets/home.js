import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={26}
    height={24}
    viewBox="0 0 26 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M2 20V10.3284C2 9.79799 2.21071 9.28929 2.58579 8.91421L4.5 7L9.50521 2.70982C10.6471 1.73108 12.3372 1.74905 13.458 2.75187L20.3336 8.90374C20.7576 9.28315 21 9.82522 21 10.3942V20C21 21.6569 19.6569 23 18 23H16C14.8954 23 14 22.1046 14 21V17.5C14 16.6716 13.3284 16 12.5 16H10.5C9.67157 16 9 16.6716 9 17.5V21C9 22.1046 8.10457 23 7 23H5C3.34315 23 2 21.6569 2 20Z"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
