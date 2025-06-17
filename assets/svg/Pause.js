import React from "react";

import Svg, { Rect } from "react-native-svg";

export default function Pause(props) {
    return (
        <Svg viewBox="0 0 500 450" style={props.style} fill={props.fill}>
            <Rect
                width={175}
                height={400}
                x={25}
                y={25}
                rx={23.57}
                ry={23.57}
            />
            <Rect
                width={175}
                height={400}
                x={300}
                y={25}
                rx={23.57}
                ry={23.57}
            />
        </Svg>
    );
}
