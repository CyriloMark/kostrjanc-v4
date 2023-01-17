import Svg, { Rect, Polygon } from "react-native-svg"

export default function Pencil_Fill(props) {

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Rect x="125" y="100" width="450" height="195" rx="52" ry="52" transform="translate(0 270) rotate(-45) scale(.8)" fill={props.fill}/>
            <Polygon x="50" y="50" transform="scale(.8)" points="59.06 304.64 29.53 402.32 0 500 97.68 470.47 195.36 440.94 127.21 372.79 59.06 304.64" fill={props.fill} />
        </Svg>
    )
}
