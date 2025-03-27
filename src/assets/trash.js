import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={25}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18.5 9L17.66 17.398C17.533 18.671 17.47 19.307 17.18 19.788C16.9257 20.2114 16.5516 20.55 16.105 20.761C15.598 21 14.96 21 13.68 21H11.32C10.041 21 9.402 21 8.895 20.76C8.44805 20.5491 8.07361 20.2106 7.819 19.787C7.531 19.307 7.467 18.671 7.339 17.398L6.5 9M14 15.5V10.5M11 15.5V10.5M5 6.5H9.615M9.615 6.5L10.001 3.828C10.113 3.342 10.517 3 10.981 3H14.019C14.483 3 14.886 3.342 14.999 3.828L15.385 6.5M9.615 6.5H15.385M15.385 6.5H20"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
