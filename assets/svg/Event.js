import Svg, { Path, Rect, Line } from "react-native-svg";

export default function Event(props) {
    const postPaths =
        "M450,49.5h-50V25.49h-.03c.01-.33,.03-.65,.03-.98h0c0-13.54-11.19-24.51-25-24.51h-50c-13.81,0-25,10.97-25,24.51h0c0,.33,.01,.65,.03,.98h-.03v24.01h-100V25.49h-.03c.01-.33,.03-.65,.03-.98h0c0-13.54-11.19-24.51-25-24.51h-50c-13.81,0-25,10.97-25,24.51h0c0,.33,.01,.65,.03,.98h-.03v24.01H50C22.39,49.5,0,71.89,0,99.5V399.5c0,27.61,22.39,50,50,50H450c27.61,0,50-22.39,50-50V99.5c0-27.61-22.39-50-50-50Zm0,311.27c0,21.39-17.34,38.73-38.73,38.73H88.73c-21.39,0-38.73-17.34-38.73-38.73V138.23c0-21.39,17.34-38.73,38.73-38.73h11.27v24.51h.03c-.01,.33-.03,.65-.03,.98h0c0,13.54,11.19,24.51,25,24.51h50c13.81,0,25-10.97,25-24.51h0c0-.33-.01-.65-.03-.98h.03v-24.51h100v24.51h.03c-.01,.33-.03,.65-.03,.98h0c0,13.54,11.19,24.51,25,24.51h50c13.81,0,25-10.97,25-24.51h0c0-.33-.01-.65-.03-.98h.03v-24.51h11.27c21.39,0,38.73,17.34,38.73,38.73v222.54Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 450">
            {/* <Path d={postPaths} fill={props.fill} /> */}
            <Rect
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeMiterlimit={10}
                x={25}
                y={75}
                width={450}
                height={350}
                rx={50}
                ry={50}
            />

            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeMiterlimit={10}
                x1={50}
                x2={450}
                y1={200}
                y2={200}
            />

            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="150"
                y1="115"
                x2="150"
                y2="35"
            />
            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="250"
                y1="115"
                x2="250"
                y2="35"
            />
            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="350"
                y1="115"
                x2="350"
                y2="35"
            />

            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="125"
                y1="345"
                x2="195"
                y2="275"
            />
            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="125"
                y1="275"
                x2="195"
                y2="345"
            />

            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="305"
                y1="345"
                x2="375"
                y2="275"
            />
            <Line
                fill="transparent"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap="round"
                strokeMiterlimit={10}
                x1="305"
                y1="275"
                x2="375"
                y2="345"
            />
        </Svg>
    );
}
