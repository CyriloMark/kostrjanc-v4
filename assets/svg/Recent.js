import Svg, { Path } from "react-native-svg"

export default function Recent(props) {

    const recentPath = "M400,0H100A100,100,0,0,0,0,100V400H400A100,100,0,0,0,500,300V100A100,100,0,0,0,400,0Zm2,254c0,27.61-26.86,50-60,50H102V154c0-27.61,26.86-50,60-50H342c33.14,0,60,22.39,60,50Z";
    
    return (
        <Svg style={props.style} viewBox="0 0 500 400">
            <Path d={recentPath} fill={props.fill} />
        </Svg>
    )
}
