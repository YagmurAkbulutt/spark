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
      d="M15.8235 26.4445C21.8011 26.4445 26.6471 21.4404 26.6471 18.0262C26.6471 14.612 21.8011 9.60791 15.8235 9.60791C9.84594 9.60791 5 14.6156 5 18.0262C5 21.4368 9.84594 26.4445 15.8235 26.4445Z"
      stroke="black"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M15.8232 21.634C16.78 21.634 17.6977 21.2539 18.3743 20.5773C19.0509 19.9007 19.431 18.983 19.431 18.0262C19.431 17.0693 19.0509 16.1517 18.3743 15.475C17.6977 14.7984 16.78 14.4183 15.8232 14.4183C14.8663 14.4183 13.9486 14.7984 13.272 15.475C12.5954 16.1517 12.2153 17.0693 12.2153 18.0262C12.2153 18.983 12.5954 19.9007 13.272 20.5773C13.9486 21.2539 14.8663 21.634 15.8232 21.634Z"
      stroke="black"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="M9.36816 8.56518L10.928 10.7419M22.814 8.83216L21.2536 11.0089M15.8292 6V9.60785"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
