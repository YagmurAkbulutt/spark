import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M2.53 14.77C2.317 16.164 3.268 17.131 4.432 17.613C8.895 19.463 15.105 19.463 19.568 17.613C20.732 17.131 21.683 16.163 21.47 14.77C21.34 13.913 20.693 13.2 20.214 12.503C19.587 11.579 19.525 10.572 19.524 9.5C19.525 5.358 16.157 2 12 2C7.843 2 4.475 5.358 4.475 9.5C4.475 10.572 4.413 11.58 3.785 12.503C3.307 13.2 2.661 13.913 2.53 14.77Z"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 19C8.458 20.725 10.076 22 12 22C13.925 22 15.541 20.725 16 19"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={18.5} cy={4.5} r={3.5} fill="#D134AA" />
  </Svg>
);
export default SVGComponent;
