import Svg, { Path, Rect, G, Line, Polygon, Circle } from "react-native-svg";

import { colors } from "../../styles";

const RECT_SIDE = 200 * Math.SQRT2;
export default function Content(props) {
    return (
        <Svg style={props.style} viewBox="0 0 1200 1200">
            {/* Rect */}
            {/* <Rect width={1200} height={1200} fill={"#00aa0050"} />
            <Rect width={550} height={550} fill={"#00aa0050"} />
            <Rect width={550} height={550} x={650} fill={"#00aa0050"} />
            <Rect width={550} height={550} y={650} fill={"#00aa0050"} />
            <Rect width={550} height={550} y={650} x={650} fill={"#00aa0050"} /> */}

            {/* Rect */}
            <G>
                <Rect
                    x={RECT_SIDE / 2 + 100}
                    y={-RECT_SIDE / 2 - 0}
                    width={RECT_SIDE}
                    height={RECT_SIDE}
                    rotation={45}
                    stroke={colors.blue}
                    strokeWidth={100}
                    fill={"transparent"}
                />
            </G>

            {/* Lupe */}
            <G x={650}>
                <Circle
                    r={550 / 2.25 - 50}
                    x={550 - 550 / 2.25}
                    y={550 / 2.25}
                    stroke={colors.white}
                    strokeWidth={100}
                    fill={"transparent"}
                />
                <Line
                    x1={50}
                    y1={500}
                    x2={550 / 3 - 50}
                    y2={(550 / 3) * 2 + 50}
                    stroke={colors.white}
                    strokeWidth={100}
                    strokeLinecap={"round"}
                    fill={"transparent"}
                />
            </G>

            {/* Add */}
            <G y={650} fill={"transparent"}>
                <Line
                    x1={50}
                    y1={550 / 2}
                    x2={500}
                    y2={550 / 2}
                    stroke={colors.white}
                    strokeLinecap="round"
                    strokeWidth={100}
                />
                <Line
                    y1={50}
                    x1={550 / 2}
                    y2={500}
                    x2={550 / 2}
                    stroke={colors.white}
                    strokeLinecap="round"
                    strokeWidth={100}
                />
            </G>
            {/* Triangle */}

            <G x={650} y={650}>
                <Polygon
                    stroke={colors.blue}
                    strokeWidth={100}
                    translateY={25}
                    points={`${550 / 2} ${125} ${450} ${475} ${100} ${475} ${
                        550 / 2
                    } ${125}`}
                    fill={"transparent"}
                />
            </G>
        </Svg>
    );
}
