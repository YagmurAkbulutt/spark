import * as React from "react";
import Svg, { G, Rect, Path, Defs, ClipPath } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={64}
    height={64}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_224_3546)">
      <Rect width={64} height={64} rx={32} fill="black" />
      <Rect width={64} height={64} rx={10.6667} fill="black" />
      <Path
        d="M14.7511 16L28.1368 33.9523L14.6665 48.5442H17.6998L29.4897 35.765L39.0177 48.5442H49.3332L35.197 29.5848L47.732 16H44.7039L33.8441 27.7668L25.0718 16H14.7511ZM19.2112 18.2368H23.9515L44.8783 46.3022H40.138L19.2112 18.2368Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_224_3546">
        <Rect width={64} height={64} rx={32} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
