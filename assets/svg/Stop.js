import React from "react";

import Svg, { Rect } from "react-native-svg";

export default function Stop(props) {
    return (
        <Svg viewBox="0 0 500 500" style={props.style} fill={props.fill}>
            <Rect width={450} height={450} x={25} y={25} rx={50} ry={50} />
        </Svg>
    );
}
