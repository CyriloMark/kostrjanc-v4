import Svg, { Path, Line } from "react-native-svg";

export default function Time(props) {
    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Path
                scale={[0.95, 0.95]}
                translate={[10, 10]}
                d={
                    "m250,25c30.39,0,59.85,5.95,87.57,17.67,26.79,11.33,50.85,27.56,71.53,48.23,20.67,20.67,36.9,44.74,48.23,71.53,11.73,27.72,17.67,57.19,17.67,87.57s-5.95,59.85-17.67,87.57c-11.33,26.79-27.56,50.85-48.23,71.53-20.67,20.67-44.74,36.9-71.53,48.23-27.72,11.73-57.19,17.67-87.57,17.67s-59.85-5.95-87.57-17.67c-26.79-11.33-50.85-27.56-71.53-48.23-20.67-20.67-36.9-44.74-48.23-71.53-11.73-27.72-17.67-57.19-17.67-87.57s5.95-59.85,17.67-87.57c11.33-26.79,27.56-50.85,48.23-71.53,20.67-20.67,44.74-36.9,71.53-48.23,27.72-11.73,57.19-17.67,87.57-17.67m0-25C111.93,0,0,111.93,0,250s111.93,250,250,250,250-111.93,250-250S388.07,0,250,0h0Z"
                }
                fill={props.fill}
                stroke={props.fill}
                strokeWidth={15}
            />
            <Line
                stroke={props.fill}
                x1="250"
                y1="250"
                x2="250"
                y2="100"
                strokeWidth={50}
                strokeLinecap={"round"}
                strokeMiterlimit={10}
            />
            <Line
                stroke={props.fill}
                x1="250"
                y1="250"
                x2="325"
                y2="325"
                strokeWidth={50}
                strokeLinecap={"round"}
                strokeMiterlimit={10}
            />
        </Svg>
    );
}
