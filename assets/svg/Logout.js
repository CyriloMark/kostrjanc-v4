import Svg, { Path, Line } from "react-native-svg";

export default function Logout(props) {
    return (
        <Svg
            viewBox="0 0 375 500"
            scaleX={-1}
            style={[
                props.style,
                {
                    transform: [
                        {
                            scaleX: -1,
                        },
                    ],
                },
            ]}>
            <Path
                d={
                    "m287.5,487.5H69.83c-31.66,0-57.33-25.68-57.33-57.36V69.86c0-31.68,25.67-57.36,57.33-57.36h217.67"
                }
                stroke={props.fill}
                strokeWidth={50}
            />
            <Path
                d={"m362.5,69.86c0-31.68-25.67-57.36-57.33-57.36H87.5"}
                stroke={props.fill}
                strokeWidth={50}
            />
            <Path
                d={"m87.5,487.5h217.67c31.66,0,57.33-25.68,57.33-57.36"}
                stroke={props.fill}
                strokeWidth={50}
            />
            <Line
                x1="362.5"
                y1="69.5"
                x2="362.5"
                y2="169.5"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap={"round"}
            />
            <Line
                x1="362.5"
                y1="330"
                x2="362.5"
                y2="430"
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap={"round"}
            />
            <Path
                d={
                    "m75,237h194.57s-67.11-69.8-67.11-69.8c-4.88-5.08-4.88-13.31,0-18.39h0c4.88-5.08,12.8-5.08,17.68,0l87.1,90.6c3.18,2.36,5.26,6.22,5.26,10.59h0c0,4.37-2.08,8.24-5.26,10.59l-87.1,90.6c-4.88,5.08-12.8,5.08-17.68,0h0c-4.88-5.08-4.88-13.31,0-18.39l67.11-69.8H75c-6.9,0-12.5-5.82-12.5-13h0c0-7.18,5.6-13,12.5-13Z"
                }
                fill={props.fill}
                scale={[1, 1]}
                translateX={10}
                stroke={props.fill}
                strokeWidth={20}
            />
        </Svg>
    );
}
