import React from "react";

import Svg, { Path } from "react-native-svg";

export default function Play(props) {
    return (
        <Svg viewBox="0 0 450 450" style={props.style} fill={props.fill}>
            <Path d="m411.97,204.11L59.07,27.52c-15.65-7.83-34.07,3.55-34.07,21.05v353.18c0,17.5,18.42,28.88,34.07,21.05l352.9-176.59c17.34-8.68,17.34-33.42,0-42.1Z" />
        </Svg>
    );
}
