import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_180_1067)">
      <Path
        d="M12 0C5.37262 0 0 5.37262 0 12C0 18.6278 5.37262 24 12 24C18.6278 24 24 18.6278 24 12C24 5.37262 18.6278 0 12 0ZM12 22.5236C6.21037 22.5236 1.5 17.7896 1.5 12C1.5 6.21033 6.21037 1.49995 12 1.49995C17.7896 1.49995 22.5 6.21035 22.5 12C22.5 17.7896 17.7896 22.5236 12 22.5236ZM17.25 11.25H12.75V6.75C12.75 6.336 12.414 6 12 6C11.586 6 11.25 6.336 11.25 6.75V11.25H6.75C6.336 11.25 6 11.586 6 12C6 12.414 6.336 12.75 6.75 12.75H11.25V17.25C11.25 17.664 11.586 18 12 18C12.414 18 12.75 17.664 12.75 17.25V12.75H17.25C17.664 12.75 18 12.414 18 12C18 11.586 17.664 11.25 17.25 11.25Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_180_1067">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;





