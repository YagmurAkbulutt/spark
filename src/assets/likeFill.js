import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M15.8154 26.9693L5.92742 17.8214C0.539333 12.4037 8.39943 1.90878 15.8154 10.398C23.2315 1.93838 31.1656 12.4259 25.7035 17.8214L15.8154 26.9767V26.9693Z"
      fill="#D134AA"
      stroke="#D134AA"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
