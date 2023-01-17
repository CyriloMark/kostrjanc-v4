import Svg, { Rect, Path } from "react-native-svg"

export default function Basket(props) {

    const basketPath = "M360,100h-35V425c0,13.81-11.19,25-25,25s-25-11.19-25-25V100h-49V425c0,13.81-11.19,25-25,25s-25-11.19-25-25V100h-51V425c0,13.81-11.19,25-25,25s-25-11.19-25-25V100H40C17.91,100,0,122.39,0,150v250c0,55.23,35.82,100,80,100h240c44.18,0,80-44.77,80-100V150c0-27.61-17.91-50-40-50Z";

    return (
        <Svg style={props.style} viewBox="0 0 400 500">
            <Rect y="0" width="400" height="80" rx="40" ry="40" fill={props.fill} />
            <Path d={basketPath} fill={props.fill} />
        </Svg>
    )
}
