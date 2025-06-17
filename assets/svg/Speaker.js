import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";

export default function Speaker(props) {
    return (
        <Svg style={props.style} viewBox="0 0 420 400">
            <Rect x={100} y={75} width={100} height={200} fill={props.fill} />
            <Circle cx={100} cy={175} r={100} fill={props.fill} />
            <Polygon
                points={"360 0 210 75 210 275 360 350 360 0"}
                fill={props.fill}
            />
            <Path
                d="M370,125c27.61,0,50,22.39,50,50,0,27.61-22.39,50-50,50v-100Z"
                fill={props.fill}
            />
            <Path
                d="M197.71,347.12l-51.7-140-71.02,25.48,51.7,140c7.14,19.33,28.82,29.3,48.43,22.26,19.61-7.04,29.72-28.41,22.58-47.74Z"
                fill={props.fill}
            />
        </Svg>
    );
}
