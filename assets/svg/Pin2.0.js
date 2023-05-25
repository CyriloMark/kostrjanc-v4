import Svg, { Polygon, Path, Ellipse } from "react-native-svg";

import { colors, colorsRGB } from "../../styles";

export default function Pin2_0(props) {
    return (
        <Svg style={props.style} viewBox="0 0 400 500">
            <Ellipse cx="200" cy="225" rx="200" ry="50" fill={colors.blue} />
            <Path
                d="m200,0c-41.42,0-75,11.19-75,25v150c0,13.81,33.58,25,75,25s75-11.19,75-25V25c0-13.81-33.58-25-75-25Z"
                fill={colors.blue}
            />
            <Polygon
                points={"225 275 175 275 175 450 200 500 225 450 225 275"}
                fill={colors.white}
            />
        </Svg>
    );
}
