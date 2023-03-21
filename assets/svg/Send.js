import Svg, { Polygon } from "react-native-svg";

export default function Send(props) {
    return (
        <Svg style={props.style} viewBox="0 0 500 400">
            <Polygon
                points={
                    "0 0 38.71 154.84 400 200 38.71 245.16 0 400 500 200 0 0"
                }
                fill={props.fill}
            />
        </Svg>
    );
}
