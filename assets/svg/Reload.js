import React from "react";
import Svg, { Path, Polygon } from "react-native-svg";

import Animated, {
    withTiming,
    withSequence,
    useSharedValue,
    Easing,
    useAnimatedStyle,
} from "react-native-reanimated";
const PUFFER = -45;
export default function Reload(props) {
    const rotationVal = useSharedValue(PUFFER);

    const rotate = () => {
        rotationVal.value = withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(360 + PUFFER, {
                duration: 500,
                easing: Easing.linear,
            })
        );
    };

    const rotationStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${rotationVal.value}deg`,
                },
            ],
        };
    });

    return (
        <Animated.View
            style={[
                {
                    width: "100%",
                    height: "100%",
                },
                rotationStyles,
                props.style,
            ]}>
            <Svg viewBox="0 0 500 440" onPress={rotate}>
                <Path
                    fill={props.fill}
                    d="M208.62,372.54c-74.22-11.09-142.56-75.09-142.56-152.39,0-85.11,69.01-154.1,154.13-154.1s154.13,68.99,154.13,154.1h66.05C440.36,98.56,341.79,0,220.18,0S0,98.56,0,220.14s92.55,214,208.92,219.86"
                />
                <Polygon
                    fill={props.fill}
                    points="500 220 403.24 365.11 306.48 220"
                />
            </Svg>
        </Animated.View>
    );
}
