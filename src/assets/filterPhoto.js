import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={59}
    height={59}
    viewBox="0 0 59 59"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={59} height={59} rx={5} fill="black" />
    <Path
      d="M29.5 40.4431C30.9196 41.7162 32.7599 42.4192 34.6667 42.4168C38.9466 42.4168 42.4167 38.9467 42.4167 34.6668C42.4167 31.0559 39.947 28.0211 36.6042 27.1609"
      stroke="#848484"
      strokeWidth={1.29167}
      strokeLinejoin="round"
    />
    <Path
      d="M22.3965 27.1609C19.0537 28.0211 16.584 31.0553 16.584 34.6668C16.584 38.9467 20.054 42.4168 24.334 42.4168C28.6139 42.4168 32.084 38.9467 32.084 34.6668C32.084 33.6657 31.8941 32.7099 31.5492 31.8316"
      stroke="#525252"
      strokeWidth={1.29167}
      strokeLinejoin="round"
    />
    <Path
      d="M29.5 32.0834C33.7799 32.0834 37.25 28.6133 37.25 24.3334C37.25 20.0534 33.7799 16.5834 29.5 16.5834C25.2201 16.5834 21.75 20.0534 21.75 24.3334C21.75 28.6133 25.2201 32.0834 29.5 32.0834Z"
      stroke="white"
      strokeWidth={1.29167}
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
