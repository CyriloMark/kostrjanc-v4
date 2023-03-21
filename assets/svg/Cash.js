import Svg, { Path, Line } from "react-native-svg";

export default function Cash(props) {
    return (
        <Svg style={props.style} viewBox="0 0 455 405">
            {/* Region Lines */}
            <Path
                d={
                    "m435.57,60c9.21-5.22,14.43-11.18,14.43-17.5,0-20.71-55.96-37.5-125-37.5s-125,16.79-125,37.5c0,6.32,5.22,12.28,14.43,17.5"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m435.57,60c-20.96,11.89-62.61,20-110.57,20s-89.61-8.11-110.57-20"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={"m200,92.5c0,20.71,55.96,37.5,125,37.5s125-16.79,125-37.5"}
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m450,142.25c0,20.71-55.96,37.5-125,37.5-12.4,0-24.37-.54-35.67-1.55"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m450,192.25c0,20.71-55.96,37.5-125,37.5-6.83,0-13.53-.17-20.06-.48"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m450,242.25c0,20.71-55.96,37.5-125,37.5-7.91,0-15.64-.22-23.14-.65"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m450,292.25c0,20.71-55.96,37.5-125,37.5-13.58,0-26.65-.65-38.89-1.85"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            {/* End Lines */}

            {/* Region Circle */}
            <Path
                d={"m286.11,322.9c5.9-10.58,10.55-21.95,13.76-33.91"}
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={"m304.94,254.27c-.33,11.98-2.08,23.61-5.07,34.72"}
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m261.71,144.59c-27.19-27.53-64.96-44.59-106.71-44.59C72.16,100,5,167.16,5,250s67.16,150,150,150c56.38,0,105.49-31.11,131.11-77.1"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={"m289.33,183.2c5.6,11.24,9.84,23.28,12.48,35.91"}
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={
                    "m304.94,254.27c.04-1.42.06-2.84.06-4.27,0-10.59-1.1-20.93-3.19-30.9"
                }
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Path
                d={"m261.71,144.59c11.13,11.27,20.48,24.29,27.62,38.61"}
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            {/* End Circle */}

            <Line
                x1="450"
                y1="292.5"
                x2="450"
                y2="42.5"
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />
            <Line
                x1="200"
                y1="43"
                x2="200"
                y2="108"
                stroke={props.fill}
                strokeMiterlimit={10}
                strokeWidth={25}
            />

            {/* Region Ewro */}
            <Path
                d="m211,326.75c-7.84,4.89-25.91,10.75-46.7,10.75-22.5,0-44.66-7.17-61.02-22.81-10.23-9.78-17.73-23.46-20.8-38.78h-21.48v-15.97h19.09c-.34-3.58-.68-5.87-.68-7.82,0-3.26.34-7.17,1.02-11.41h-19.43v-15.64h21.82c3.75-14.99,11.25-28.35,21.48-38.13,17.39-16.62,40.91-24.44,64.43-24.44,20.11,0,33.07,4.89,41.93,9.12l-6.82,20.2c-7.84-3.91-19.09-7.82-35.45-7.82-15,0-30,4.56-41.93,15.64-6.82,6.52-12.27,15.32-13.98,25.42h84.89v15.64h-88.3c-.34,3.58-.68,7.17-.68,9.45,0,2.93,0,5.87.34,9.78h88.64v15.97h-85.23c2.39,9.45,7.16,17.6,13.3,23.46,12.27,11.41,25.91,15.97,42.95,15.97s30.68-4.56,38.52-8.47l4.09,19.88Z"
                fill={props.fill}
            />
            {/* End Ewro */}
        </Svg>
    );
}
