import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

type IconProps = { color?: string };

const EcoIcon = ({ color }: IconProps) => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M9.43754 0.298947C7.39754 -0.201053 5.41754 -0.0510532 3.66754 0.578947C2.94754 0.838947 2.75754 1.79895 3.35754 2.28895C5.58754 4.11895 7.00754 6.88895 7.00754 9.99895C7.00754 13.1089 5.58754 15.8789 3.35754 17.7089C2.76754 18.1989 2.93754 19.1589 3.66754 19.4089C4.70754 19.7889 5.83754 19.9989 7.00754 19.9989C13.0575 19.9989 17.8575 14.6189 16.8775 8.39895C16.2675 4.47895 13.2875 1.23895 9.43754 0.298947Z"
      fill={color || "url(#paint0_linear_1:104)"}
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1:104"
        x1="17.0051"
        y1="17.3324"
        x2="3.32301"
        y2="-0.251333"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7600D3" />
        <Stop offset="1" stopColor="#36ABFF" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default EcoIcon;
