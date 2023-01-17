import Svg, { Path, Circle } from "react-native-svg"

export default function Web(props) {

    const paths = [
        "M25,250h0Z",
        "M350.33,260.01c-2.51,104.33-46.49,190.24-99.89,190.24s-97.39-86.01-99.89-190.24c-2.68-111.72,43.1-210.05,100.14-209.76,56.81,.28,102.32,98.29,99.64,209.76Z",
        "M260.21,150.36c104.33,2.51,190.24,46.49,190.24,99.89s-86.01,97.39-190.24,99.89c-111.72,2.68-210.05-43.1-209.76-100.14,.28-56.81,98.29-102.32,209.76-99.64Z"
    ];

    return (
        <Svg style={[props.style, { backgroundColor: props.bg }]} viewBox="0 0 500 500">
            <Circle cx={250} cy={250} r={200} stroke={props.fill} strokeWidth={25} />
            <Path d={paths[0]} stroke={props.fill} strokeWidth={25} />
            <Path d={paths[1]} stroke={props.fill} strokeWidth={25} />
            <Path d={paths[2]} stroke={props.fill} strokeWidth={25} />
        </Svg>
    )
}
