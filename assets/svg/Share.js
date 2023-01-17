import Svg, { Circle, Line } from "react-native-svg"

export default function Share(props) {

    return (
        <Svg style={props.style} viewBox="0 0 550 500">
            <Circle cx="100" cy="250" r="100" fill={props.fill} />
            <Circle cx="400" cy="100" r="100" fill={props.fill} />
            <Circle cx="400" cy="400" r="100" fill={props.fill} />
            <Line x1="100" y1="250" x2="400" y2="100" strokeWidth={50} stroke={props.fill} />
            <Line x1="400" y1="400" x2="100" y2="250" strokeWidth={50} stroke={props.fill} />
        </Svg>
    )
}
