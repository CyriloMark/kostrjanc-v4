import Svg, { Path } from "react-native-svg"

export default function Search(props) {

    const searchPath = "M300,0C189.56,0,100,89.54,100,200a199.11,199.11,0,0,0,27.7,101.59l-.11.1L93.08,336.23,10.54,418.77c-16.16,16.16-13.43,45.09,6.09,64.62s48.46,22.25,64.62,6.09l82.54-82.54,34.53-34.53.11-.11A199.11,199.11,0,0,0,300,400c110.46,0,200-89.54,200-200S410.48,0,300,0Zm0,300A100,100,0,1,1,400,200,100,100,0,0,1,300,300Z";

    return (
        <Svg style={props.style} viewBox="0 0 500 500">
            <Path d={searchPath} fill={props.fill} />
        </Svg>
    )
}
