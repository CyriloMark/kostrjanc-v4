import React from "react";
import Svg, { Path, LinearGradient, Stop, Defs } from "react-native-svg";

export const Heart = React.forwardRef((props, ref) => {
    return (
        <Svg style={props.style} viewBox="0 0 550 500">
            <Defs>
                <LinearGradient id="purpleGradient" x1={0} y1={0} x2={1} y2={1}>
                    <Stop offset={"0%"} stopColor={"#8829ac"} stopOpacity={1} />
                    <Stop
                        offset={"66%"}
                        stopColor={"#ca55e7"}
                        stopOpacity={1}
                    />
                </LinearGradient>
            </Defs>
            <Path
                y={15}
                d={
                    "M153.1,0C74,0,10,68.8,10,153.8C10,339.9,275,500,275,500s265-159.1,265-345.7C540,69.4,476,0.5,396.9,0.5c-51.4,0-96.6,29.2-121.8,73C250,29.5,204.7,0.1,153.1,0L153.1,0L153.1,0z"
                }
                fill={
                    props.fill === "purpleGradient"
                        ? "url(#purpleGradient)"
                        : props.fill
                }
            />
        </Svg>
    );
});
