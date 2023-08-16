import Svg, { Line, Path } from "react-native-svg";

export default function Coffee(props) {
    return (
        <Svg style={props.style} viewBox="0 0 477 450" fill={null}>
            <Path
                d="m374.56,367.47c5.49-6.4,10.48-13.14,14.94-20.17"
                stroke={props.fill}
                strokeWidth={25}
                strokeLinecap="round"
                strokeMiterlimit={10}
            />
            <Path
                d="m414.26,254.01c.16,2.84.24,5.69.24,8.57,0,30.74-9.08,59.62-25,84.72"
                stroke={props.fill}
                strokeWidth={25}
                strokeLinecap="round"
                strokeMiterlimit={10}
            />

            <Path
                d="m410.82,229.09c1.8,8.12,2.96,16.44,3.43,24.91"
                stroke={props.fill}
                strokeWidth={25}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Henkel */}
            <Path
                d="m414.26,254.01c.08,0,.16,0,.24,0,27.61,0,50,22.39,50,50s-22.39,50-50,50c-9.11,0-17.64-2.45-25-6.7"
                stroke={props.fill}
                strokeWidth={25}
            />

            {/* Body */}
            <Path
                d="m410.82,229.09c-1.25-5.63-2.8-11.17-4.65-16.59H22.83c-5.41,15.87-8.33,32.67-8.33,50.07,0,96.61,89.54,174.93,200,174.93,65.46,0,123.58-27.51,160.06-70.03"
                stroke={props.fill}
                strokeWidth={25}
                strokeMiterlimit={10}
                strokeLinejoin="round"
            />

            <Line
                x1="12.5"
                y1="437.5"
                x2="412.5"
                y2="438.5"
                stroke={props.fill}
                strokeWidth={25}
                strokeLinecap="round"
                strokeMiterlimit={10}
            />

            {/* //#region Dampf */}
            <Path
                d="m291.95,162.5c28.64-20.13,49.4-41.36,44.93-59.42-5.58-22.53-46.9-25.91-49.29-45.72-1.35-11.18,9.92-25.76,48.35-44.86"
                stroke={props.fill}
                strokeWidth={25}
                strokeMiterlimit={10}
                strokeLinecap="round"
            />
            <Path
                d="m191.95,162.5c28.64-20.13,49.4-41.36,44.93-59.42-5.58-22.53-46.9-25.91-49.29-45.72-1.35-11.18,9.92-25.76,48.35-44.86"
                stroke={props.fill}
                strokeWidth={25}
                strokeMiterlimit={10}
                strokeLinecap="round"
            />
            <Path
                d="m91.95,162.5c28.64-20.13,49.4-41.36,44.93-59.42-5.58-22.53-46.9-25.91-49.29-45.72-1.35-11.18,9.92-25.76,48.35-44.86"
                stroke={props.fill}
                strokeWidth={25}
                strokeMiterlimit={10}
                strokeLinecap="round"
            />
            {/* //#endregion */}
        </Svg>
    );
}
