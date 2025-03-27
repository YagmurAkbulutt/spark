import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={28}
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M4.57812 3.53005V21.878L11.7515 16.526L18.9248 21.878V3.53005C18.9248 2.68632 18.2807 2 17.489 2H6.01397C5.22219 2 4.57812 2.68632 4.57812 3.53005Z"
      stroke="black"
      strokeWidth={1.47479}
      strokeLinecap="round"
      strokeLinejoin="round"
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
