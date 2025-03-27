import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={21}
    height={23}
    viewBox="0 0 21 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1 19V9.32843C1 8.79799 1.21071 8.28929 1.58579 7.91421L3.5 6L8.50521 1.70982C9.64708 0.731076 11.3372 0.749053 12.458 1.75187L19.3336 7.90374C19.7576 8.28315 20 8.82522 20 9.39422V19C20 20.6569 18.6569 22 17 22H15C13.8954 22 13 21.1046 13 20V16.5C13 15.6716 12.3284 15 11.5 15H9.5C8.67157 15 8 15.6716 8 16.5V20C8 21.1046 7.10457 22 6 22H4C2.34315 22 1 20.6569 1 19Z"
      fill="black"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
