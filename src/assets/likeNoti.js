import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={9.5} cy={9.5} r={9.5} fill="#D134AA" />
    <Path
      d="M9.49286 14.882L4.83872 10.5763C2.30263 8.02623 6.00225 3.08643 9.49286 7.08216C12.9835 3.10037 16.7179 8.03668 14.147 10.5763L9.49286 14.8855V14.882Z"
      fill="white"
    />
  </Svg>
);
export default SVGComponent;
