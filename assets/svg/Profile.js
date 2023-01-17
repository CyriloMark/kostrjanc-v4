import Svg, { Path } from "react-native-svg"

export default function Profile(props) {

    const profilePath = "M333.57,267.88A149.4,149.4,0,0,0,391.14,150C391.14,67.18,323.47,0,240,0S88.86,67.18,88.86,150a149.4,149.4,0,0,0,57.57,117.84A251.13,251.13,0,0,0,0,426.37,125.57,125.57,0,0,0,114.47,500H365.53A125.57,125.57,0,0,0,480,426.37,251.13,251.13,0,0,0,333.57,267.88Z";

    return (
        <Svg viewBox="0 0 480 500">
            <Path d={profilePath} fill={props.fill} />
        </Svg>
    )
}
