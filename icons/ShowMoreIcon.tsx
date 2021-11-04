import React from "react";
import Svg, { G, Path } from "react-native-svg";
import { mediumBrown } from "../config/Colors";

type IconProps = { color?: string };

const ShowMoreIcon = ({ color }: IconProps) => (
  <Svg width="12" height="7" viewBox="0 0 12 7" fill="none">
    <Path
      d="M10.1611 0.310934L5.99463 4.43546L1.82819 0.310934C1.4094 -0.103645 0.732886 -0.103645 0.314094 0.310934C-0.104698 0.725513 -0.104698 1.39522 0.314094 1.80979L5.24295 6.68907C5.66175 7.10364 6.33826 7.10364 6.75705 6.68907L11.6859 1.80979C12.1047 1.39522 12.1047 0.725513 11.6859 0.310934C11.2671 -0.0930144 10.5799 -0.103645 10.1611 0.310934Z"
      fill={color || mediumBrown}
    />
  </Svg>
);

export default ShowMoreIcon;
