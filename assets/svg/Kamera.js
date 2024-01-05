import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { colors } from "../../styles";

export default function Kamera(props) {
    return (
        <Svg viewBox="0 0 500 431.5" style={props.style}>
            <Rect
                y={50}
                width={500}
                height={383}
                rx={50}
                ry={50}
                fill={props.fill}
            />
            <Circle cx={250} cy={240} r={125} fill={colors.black} />
            <Circle cx={250} cy={240} r={66} fill={props.fill} />
            <Path
                fill={props.fill}
                d="M94.96,0h34.22C139.29,0,147.5,8.21,147.5,18.32v31.68h-75v-27.54C72.5,10.07,82.57,0,94.96,0Z"
            />
            <Circle cx={425} cy={125} r={33} fill={colors.black} />
        </Svg>
    );
}
