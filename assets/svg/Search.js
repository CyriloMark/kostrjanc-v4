import Svg, { Path, Line } from "react-native-svg";

export default function Search(props) {
    return (
        <Svg style={[props.style]} viewBox="0 0 500 500">
            <Path
                d={
                    "m299.75,28.57c45.79,0,88.84,17.83,121.22,50.21,32.38,32.38,50.21,75.43,50.21,121.22s-17.83,88.84-50.21,121.22c-32.38,32.38-75.43,50.21-121.22,50.21s-88.84-17.83-121.22-50.21c-32.38-32.38-50.21-75.43-50.21-121.22s17.83-88.84,50.21-121.22c32.38-32.38,75.43-50.21,121.22-50.21m0-28.57C189.29,0,99.75,89.54,99.75,200s89.54,200,200,200,200-89.54,200-200S410.21,0,299.75,0h0Z"
                }
                fill={props.fill}
                stroke={props.fill}
                strokeWidth={10}
            />
            <Line
                x1={"25"}
                y1={"475"}
                x2={"150"}
                y2={"350"}
                stroke={props.fill}
                strokeWidth={50}
                strokeLinecap={"round"}
            />
        </Svg>
    );
}
