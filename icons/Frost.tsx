import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

type IconProps = { color?: string };

const FrostIcon = ({ color }: IconProps) => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M19 9H15.83L18.37 6.46C18.76 6.07 18.76 5.44 18.37 5.05C17.98 4.66 17.34 4.66 16.95 5.05L13 9H11V7L14.95 3.05C15.34 2.66 15.34 2.02 14.95 1.63C14.56 1.24 13.93 1.24 13.54 1.63L11 4.17V1C11 0.45 10.55 0 10 0C9.45 0 9 0.45 9 1V4.17L6.46 1.63C6.07 1.24 5.44 1.24 5.05 1.63C4.66 2.02 4.66 2.66 5.05 3.05L9 7V9H7L3.05 5.05C2.66 4.66 2.02 4.66 1.63 5.05C1.24 5.44 1.24 6.07 1.63 6.46L4.17 9H1C0.45 9 0 9.45 0 10C0 10.55 0.45 11 1 11H4.17L1.63 13.54C1.24 13.93 1.24 14.56 1.63 14.95C2.02 15.34 2.66 15.34 3.05 14.95L7 11H9V13L5.05 16.95C4.66 17.34 4.66 17.98 5.05 18.37C5.44 18.76 6.07 18.76 6.46 18.37L9 15.83V19C9 19.55 9.45 20 10 20C10.55 20 11 19.55 11 19V15.83L13.54 18.37C13.93 18.76 14.56 18.76 14.95 18.37C15.34 17.98 15.34 17.34 14.95 16.95L11 13V11H13L16.95 14.95C17.34 15.34 17.98 15.34 18.37 14.95C18.76 14.56 18.76 13.93 18.37 13.54L15.83 11H19C19.55 11 20 10.55 20 10C20 9.45 19.55 9 19 9Z"
      fill={color || "url(#paint0_linear_1:103)"}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1:103"
        x1="17"
        y1="16.5"
        x2="5"
        y2="6.5"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00E9F8" />
        <Stop offset="1" stopColor="#12C6FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default FrostIcon;
