import Svg, { Circle, Line, Path } from "react-native-svg";
import { colors } from "../../styles";

export default function Warn(props) {
    const warnPaths =
        "M250,0,0,500H500Zm35.09,445h-70V383.78h70ZM273,366.38H226.64L212.5,252V195h75v57Z";

    if (props.old)
        return (
            <Svg style={props.style} viewBox="0 0 500 500">
                <Path d={warnPaths} fill={props.fill} />
            </Svg>
        );

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            {/* <Circle
                fill={"transparent"}
                stroke={props.fill}
                strokeWidth={65}
                strokeLinecap="round"
                strokeMiterlimit={10}
                cx={250}
                cy={250}
                r={220}
            />
            <Circle fill={props.fill} cx={250} cy={365} r={40} />
            <Line
                stroke={props.fill}
                strokeWidth={60}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1={250}
                y1={270}
                x2={250}
                y2={125}
            /> */}

            <Circle cx={250} cy={250} r={250} fill={props.fill} />
            <Circle cx={250} cy={400} r={45} fill={colors.black} />
            <Line
                x1={250}
                y1={290}
                x2={250}
                y2={87.5}
                strokeWidth={75}
                strokeMiterlimit={10}
                strokeLinecap="round"
                stroke={colors.black}
            />
        </Svg>
    );
}
