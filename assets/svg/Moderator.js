import Svg, { Path } from "react-native-svg"

export default function Moderator(props) {

    const modPath = "M499.8,100h.2L250,0,0,100H.2c-1.05,35.45-2.25,201.44,121.9,320,44.41,42.41,91.8,66.28,127.9,80,36.09-13.72,83.49-37.59,127.9-80,124.16-118.56,122.96-284.55,121.9-320Zm-219.8,220l-60,60-120-120,60-60,60,60,120-120,60,60-120,120Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Path d={modPath} fill={props.fill} />
        </Svg>
    )
}
