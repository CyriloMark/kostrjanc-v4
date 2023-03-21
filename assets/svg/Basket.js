import Svg, { Line, Path } from "react-native-svg";

export default function Basket(props) {
    return (
        <Svg style={props.style} viewBox="0 0 350 500">
            <Path
                d={
                    "m300,150v256.46c0,24.01-19.53,43.54-43.54,43.54H93.54c-24.01,0-43.54-19.53-43.54-43.54V150h250m50-50H0v306.46c0,51.66,41.88,93.54,93.54,93.54h162.92c51.66,0,93.54-41.88,93.54-93.54V100h0Z"
                }
                fill={props.fill}
            />
            <Line
                x1={128}
                y1={189}
                x2={128}
                y2={411}
                stroke={props.fill}
                strokeLinecap={"round"}
                strokeWidth={50}
            />
            <Line
                x1={228}
                y1={189}
                x2={228}
                y2={411}
                stroke={props.fill}
                strokeLinecap={"round"}
                strokeWidth={50}
            />
            <Path
                d={
                    "m168,0h20c22.08,0,40,17.92,40,40h-100c0-22.08,17.92-40,40-40Z"
                }
                fill={props.fill}
            />
            <Path
                d={
                    "m25,40h300c13.8,0,25,11.2,25,25v25H0v-25c0-13.8,11.2-25,25-25Z"
                }
                fill={props.fill}
            />
        </Svg>
    );
}
