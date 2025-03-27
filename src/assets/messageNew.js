import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";
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
      d="M24.0002 8H8.00016C6.5274 8 5.3335 9.19391 5.3335 10.6667V21.3333C5.3335 22.8061 6.5274 24 8.00016 24H24.0002C25.4729 24 26.6668 22.8061 26.6668 21.3333V10.6667C26.6668 9.19391 25.4729 8 24.0002 8Z"
      stroke="black"
      strokeWidth={1.5}
    />
    <Path
      d="M5.3335 12L14.8082 16.7373C15.1783 16.9223 15.5864 17.0186 16.0002 17.0186C16.4139 17.0186 16.822 16.9223 17.1922 16.7373L26.6668 12"
      stroke="black"
      strokeWidth={1.5}
    />
    <Circle cx={26.5} cy={8.5} r={3.5} fill="#D134AA" />
  </Svg>
);
export default SVGComponent;
