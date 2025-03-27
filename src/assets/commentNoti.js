import * as React from "react";
import Svg, { Circle, G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={9.5} cy={9.5} r={9.5} fill="black" />
    <G clipPath="url(#clip0_354_6025)">
      <Path
        d="M8.12533 15.0833C8.00377 15.0833 7.88719 15.035 7.80123 14.949C7.71528 14.8631 7.66699 14.7465 7.66699 14.625V13.25H5.83366C5.59054 13.25 5.35739 13.1534 5.18548 12.9815C5.01357 12.8096 4.91699 12.5764 4.91699 12.3333V6.83329C4.91699 6.59018 5.01357 6.35702 5.18548 6.18511C5.35739 6.0132 5.59054 5.91663 5.83366 5.91663H13.167C13.4101 5.91663 13.6433 6.0132 13.8152 6.18511C13.9871 6.35702 14.0837 6.59018 14.0837 6.83329V12.3333C14.0837 12.5764 13.9871 12.8096 13.8152 12.9815C13.6433 13.1534 13.4101 13.25 13.167 13.25H10.3712L8.67533 14.9504C8.58366 15.0375 8.46908 15.0833 8.35449 15.0833H8.12533Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_354_6025">
        <Rect width={11} height={11} fill="white" transform="translate(4 5)" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
