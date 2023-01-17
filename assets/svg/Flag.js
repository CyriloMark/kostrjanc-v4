import Svg, { Path, Rect } from "react-native-svg"

export default function Flag(props) {

    const path = "M450,120.01v179.78c-.81,2.94-9.49,15.57-39.54,28.37-33.06,14.08-76.73,21.84-122.96,21.84s-89.89-7.76-122.96-21.84c-30.05-12.8-38.73-25.43-39.54-28.37V120.01c45.35,19.38,102.59,29.99,162.5,29.99s117.15-10.61,162.5-29.99M500,0c0,55.23-95.14,100-212.5,100S75,55.23,75,0V300c0,55.23,95.14,100,212.5,100s212.5-44.77,212.5-100V0h0Z";
    
    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Rect width={50} height={500} fill={props.fill} />
            <Path d={path} fill={props.fill} />
        </Svg>
    )
}
