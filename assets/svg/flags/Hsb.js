import Svg, { Rect } from "react-native-svg";

export default function Hsb(props) {
    return (
        <Svg style={props.style} viewBox="0 0 5 3">
            <Rect width={5} height={1} y={0} fill={"#0035a9"} />
            <Rect width={5} height={1} y={1} fill={"#CF0821"} />
            <Rect width={5} height={1} y={2} fill={"#ffffff"} />
        </Svg>
    );
}
