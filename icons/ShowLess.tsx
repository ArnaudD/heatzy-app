import React from "react";
import Svg, { Path } from "react-native-svg";

type IconProps = { color?: string };

const ShowLessIcon = ({ color }: IconProps) => (
  <Svg width="12" height="7" viewBox="0 0 12 7" fill="none">
    <Path
      d="M1.83893 6.68907L6.00537 2.56454L10.1718 6.68907C10.5906 7.10364 11.2671 7.10364 11.6859 6.68907C12.1047 6.27449 12.1047 5.60478 11.6859 5.19021L6.75705 0.310934C6.33825 -0.103644 5.66174 -0.103644 5.24295 0.310935L0.314094 5.19021C-0.104698 5.60478 -0.104698 6.27449 0.314094 6.68907C0.732886 7.09302 1.42013 7.10365 1.83893 6.68907V6.68907Z"
      fill="white"
    />
  </Svg>
);

export default ShowLessIcon;
