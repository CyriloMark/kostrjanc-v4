import Svg, { Path } from "react-native-svg"

export default function Heart(props) {

    const heartPath = "M421.98,181.48L262.29,21.79h0c-27.56-27.56-70.61-29.2-96.15-3.65L18.14,166.14c-25.54,25.54-23.91,68.59,3.65,96.15h0c27.56,27.56,70.61,29.2,96.15,3.65l28.94-28.94v215.96c0,25.64,20.78,46.42,46.42,46.42h57.15c25.64,0,46.42-20.78,46.42-46.42V241.39l32.6,32.6c27.56,27.56,70.61,29.2,96.15,3.65,25.54-25.54,23.91-68.59-3.65-96.15Z";

    return (
        <Svg style={props.style} viewBox="0 0 450 500">
            <Path d={heartPath} fill={props.fill} />
        </Svg>
    )
}
