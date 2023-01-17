import Svg, { Rect, Path } from "react-native-svg"

export default function Basket(props) {

    const path = "M400,225c0-20.98-51.71-38.94-125-46.36V25c0-13.81-33.58-25-75-25S125,11.19,125,25V178.64C51.71,186.06,0,204.02,0,225c0,25.5,76.34,46.54,175,49.61v175.39l25,50,25-50v-175.39c98.66-3.08,175-24.11,175-49.61Z";

    return (
        <Svg style={props.style} viewBox="0 0 400 500">
            <Path d={path} fill={props.fill} />
        </Svg>
    )
}
