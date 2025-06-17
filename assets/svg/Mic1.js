import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";

export default function Mic1(props) {
    return (
        <Svg style={props.style} viewBox="0 0 374.97 562.5">
            <Path
                d="M187.49,75c27.57,0,50,22.43,50,50v125c0,27.57-22.43,50-50,50s-50-22.43-50-50v-125c0-27.57,22.43-50,50-50M187.49,0h0C118.45,0,62.49,55.96,62.49,125v125c0,69.04,55.96,125,125,125h0c69.04,0,125-55.96,125-125v-125C312.49,55.96,256.52,0,187.49,0h0Z"
                fill={props.fill}
            />
            <Path
                d="M25,251.1c.59,89.24,73.11,161.4,162.49,161.4s161.89-72.16,162.49-161.4"
                fill={"transparent"}
                stroke={props.fill}
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeWidth={50}
            />
            <Rect x={150} y={387.5} width={75} height={150} fill={props.fill} />
            <Rect
                x={162.5}
                y={425}
                width={50}
                height={225}
                rx={25}
                ry={25}
                fill={props.fill}
                rotation={-90}
                translateX={-350}
                translateY={725}
            />
        </Svg>
    );
}
