import Svg, { Path } from "react-native-svg"

export default function Add(props) {

    const addPath = "M475,200H300V25A25,25,0,0,0,275,0H225a25,25,0,0,0-25,25V200H25A25,25,0,0,0,0,225v50a25,25,0,0,0,25,25H200V475a25,25,0,0,0,25,25h50a25,25,0,0,0,25-25V300H475a25,25,0,0,0,25-25V225A25,25,0,0,0,475,200Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Path d={addPath} fill={props.fill} />
        </Svg>
    )
}
