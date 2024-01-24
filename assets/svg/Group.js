import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export default function Group(props) {
    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Circle
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeDasharray={"0 0 332.65 138.61"}
                r={225}
                cx={250}
                cy={250}
                fill={"transparent"}
            />
            <Path
                d="M305.97,251.33c19.51-16.13,31.94-40.51,31.94-67.8,0-48.55-39.36-87.92-87.92-87.92s-87.92,39.36-87.92,87.92c0,27.29,12.43,51.67,31.94,67.8-44.84,10.53-75.9,33.31-75.9,59.72,0,36.42,59.04,84.57,131.87,84.57s131.87-48.15,131.87-84.57c0-26.41-31.06-49.19-75.9-59.72Z"
                fill={props.fill}
            />
        </Svg>
    );
}
