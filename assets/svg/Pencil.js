import Svg, { Rect, Polygon, Path } from "react-native-svg";

export default function Pencil(props) {
    return (
        // <Svg style={props.style} viewBox="0 0 500 500" fill={"transparent"}>
        //     <Rect
        //         x="125"
        //         y="100"
        //         width="450"
        //         height="195"
        //         rx="52"
        //         ry="52"
        //         transform="translate(0 270) rotate(-45) scale(.8)"
        //         strokeWidth={25}
        //         stroke={props.fill}
        //     />
        //     <Polygon
        //         x="50"
        //         y="50"
        //         transform="scale(.8)"
        //         points="59.06 304.64 29.53 402.32 0 500 97.68 470.47 195.36 440.94 127.21 372.79 59.06 304.64"
        //         stroke={props.fill}
        //         strokeWidth={25}
        //     />
        // </Svg>
        <Svg style={props.style} viewBox="0 0 386.21 385.98">
            <Path
                d="m300.85,15c9.35,0,18.14,3.64,24.75,10.25l35.36,35.36c6.61,6.61,10.25,15.4,10.25,24.75s-3.64,18.14-10.25,24.75l-201.53,201.53-84.85-84.85L276.1,25.25c6.61-6.61,15.4-10.25,24.75-10.25m0-15c-12.8,0-25.59,4.88-35.36,14.64L53.36,226.78l106.07,106.07,212.13-212.13c19.53-19.53,19.53-51.18,0-70.71l-35.36-35.36c-9.76-9.76-22.56-14.64-35.36-14.64h0Z"
                fill={props.fill}
            />
            <Polygon
                points="28.28 357.69 67.18 241.02 53.03 226.88 0 385.98 159.1 332.94 144.96 318.8 28.28 357.69"
                fill={props.fill}
            />
        </Svg>
    );
}
