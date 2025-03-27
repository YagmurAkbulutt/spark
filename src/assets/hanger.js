import * as React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={40} height={40} rx={3} fill="black" />
    <G clipPath="url(#clip0_24_1167)">
      <Path
        d="M15.9453 13.4881C15.9453 11.3441 17.6813 9.6001 19.8333 9.6001C21.9853 9.6001 23.7213 11.3361 23.7213 13.4881C23.7213 15.6401 21.9853 17.3761 19.8333 17.3761V19.3201"
        stroke="white"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.38517 26.3521L19.8252 19.3121L31.2652 26.3521C32.0012 26.8081 32.4492 27.6081 32.4492 28.4721C32.4492 29.8481 31.3372 30.9681 29.9532 30.9681H9.69717C8.32117 30.9681 7.20117 29.8561 7.20117 28.4721C7.20117 27.6081 7.64917 26.8001 8.38517 26.3521Z"
        stroke="white"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_24_1167">
        <Rect
          width={26.856}
          height={22.968}
          fill="white"
          transform="translate(6.40039 8.80005)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
