import Svg, { Path } from "react-native-svg"

export default function Post(props) {

    const postPaths = ["M298.6,286.23h0L157,144.63,0,301.63v48.37c0,27.61,22.39,50,50,50H450c27.61,0,50-22.39,50-50V120.18l-183.73,183.73-17.68-17.68Z",
        "M450,0H50C22.39,0,0,22.39,0,50v216.27L157,109.27l159.27,159.27L500,84.82V50c0-27.61-22.39-50-50-50Zm-138,144c-27.61,0-50-22.39-50-50s22.39-50,50-50,50,22.39,50,50-22.39,50-50,50Z"];

    return (
        <Svg style={props.style} viewBox="0 0 500 400">
            <Path d={postPaths[0]} fill={props.fill} />
            <Path d={postPaths[1]} fill={props.fill} />
        </Svg>
    )
}
