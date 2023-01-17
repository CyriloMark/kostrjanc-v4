import Svg, { Path, Rect } from "react-native-svg"

export default function Ban(props) {

    const banPath = "M238.14,246.24l-32.54-32.54-32.08,32.08-35.28,35.28L13.15,406.15c-17.71,17.71-17.51,46.64,.46,64.62l16.27,16.27c17.97,17.97,46.9,18.18,64.62,.46l125.09-125.09,35.28-35.28,32.08-32.08-32.54-32.54-16.27-16.27Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Rect x="229" y="-28" width="138" height="460" rx="23" ry="23" transform="translate(-55.50 270) rotate(-45)" fill={props.fill}/>
            <Path fill={props.fill} d={banPath} />
        </Svg>
    )
}
