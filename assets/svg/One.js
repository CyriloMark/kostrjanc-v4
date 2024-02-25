import Svg, { Path } from "react-native-svg";

export default function One(props) {
    return (
        <Svg style={props.style} viewBox=" 0 0 256 451">
            <Path
                d="M156.25,51.64v.18l-.18-.18L14.64,193.06c-19.53,19.53-19.53,51.18,0,70.71h0c19.53,19.53,51.18,19.53,70.71,0l70.89-70.89v208.76c0,27.61,22.39,50,50,50h0c27.61,0,50-22.39,50-50V51.64h0c0-55-31.82-68.18-70.71-29.29l-29.29,29.29Z"
                fill={props.fill}
            />
        </Svg>
    );
}
