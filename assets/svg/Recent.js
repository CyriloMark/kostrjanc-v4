import Svg, { Path, Circle } from "react-native-svg";

export default function Recent(props) {
    const recentPath =
        "m283.03,117.7c10.03,50.11,49.61,89.69,99.72,99.72v80.4c0,42.56-34.62,77.18-77.18,77.18H25v-180.11c0-42.56,34.62-77.18,77.18-77.18h180.84m22.53-25H102.18C45.75,92.7,0,138.45,0,194.89v205.11h305.56c56.44,0,102.18-45.75,102.18-102.18v-102.93c-56.43,0-102.18-45.75-102.18-102.18h0Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 400">
            <Path
                d={recentPath}
                fill={props.fill}
                stroke={props.fill}
                strokeWidth={25}
            />
            <Circle cx={"408.25"} cy={"92.25"} r={"75"} fill={props.fill} />
        </Svg>
    );
}
