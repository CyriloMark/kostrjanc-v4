import Svg, { Path } from "react-native-svg"

export default function Warn(props) {

    const warnPaths = "M250,0,0,500H500Zm35.09,445h-70V383.78h70ZM273,366.38H226.64L212.5,252V195h75v57Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Path d={warnPaths} fill={props.fill} />
        </Svg>
    )
}
