import Svg, { Path, Rect } from "react-native-svg";

export default function Ban(props) {
    return (
        <Svg
            style={props.style}
            viewBox="0 0 481.41 482.41"
            stroke={props.fill}
            strokeWidth={2}>
            <Rect
                x="5"
                y="310"
                rx={"25"}
                ry={"25"}
                width="252.5"
                height="101"
                transform="translate(-214.75 193.66) rotate(-45)"
                fill={props.fill}
            />
            <Path
                fill={props.fill}
                d={
                    "m474.46,265.68L215.73,6.95c-7.94-7.94-20.81-7.94-28.75,0l-100.62,100.62c-7.94,7.94-7.94,20.81,0,28.75l258.73,258.73c7.94,7.94,20.81,7.94,28.75,0l100.62-100.62c7.94-7.94,7.94-20.81,0-28.75Z"
                }
            />
        </Svg>
    );
}
