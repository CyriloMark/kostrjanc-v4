import Svg, { Rect, Path } from "react-native-svg";

export default function Keyboard(props) {
    return (
        <Svg style={props.style} viewBox="0 0 360 295">
            <Path
                stroke={props.fill}
                strokeWidth={25}
                d="m80,100s0-49.97,100-49.97c100-.03,100-50.03,100-50.03"
            />

            <Rect
                x="240"
                y="125"
                width="50"
                height="50"
                rx="15"
                ry="15"
                fill={props.fill}
            />
            <Rect
                y="125"
                width="50"
                height="50"
                rx="15"
                ry="15"
                fill={props.fill}
            />
            <Rect
                fill={props.fill}
                x="60"
                y="125"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="120"
                y="125"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="180"
                y="125"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="70"
                y="185"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                y="185"
                width="60"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                y="245"
                width="75"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="285"
                y="245"
                width="75"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="85"
                y="245"
                width="190"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="130"
                y="185"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="190"
                y="185"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Rect
                fill={props.fill}
                x="250"
                y="185"
                width="50"
                height="50"
                rx="15"
                ry="15"
            />
            <Path
                d="m345,125h-33.2c-6.52,0-11.8,5.28-11.8,11.8v33.2c0,2.76,2.24,5,5,5s5,2.24,5,5v40c0,8.28,6.72,15,15,15h20c8.28,0,15-6.72,15-15v-80c0-8.28-6.72-15-15-15Z"
                fill={props.fill}
            />
        </Svg>
    );
}