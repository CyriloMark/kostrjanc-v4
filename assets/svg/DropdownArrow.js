import React from "react";
import Svg, { Polygon } from "react-native-svg";

export default function DropdownArrow(props) {
    return (
        <Svg style={props.style} viewBox="0 0 350 250">
            <Polygon
                fill={"transparent"}
                stroke={props.fill}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={50}
                points="275 50 175 200 75 50 175 200 275 50"
            />
        </Svg>
    );
}
