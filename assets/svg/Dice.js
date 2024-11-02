import React, { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withRepeat,
    withDelay,
    withSequence,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { View } from "react-native";

const defaultDelay = 2500; //5000;
const defaultRotationDelay = 125;
const jumpHeight = 25;
const maxScale = 1.1;
const minScale = 1.0;

export default function Dice(props) {
    const [number, setNumber] = useState(props.number ? props.number : 6);
    const [spinning, setSpinning] = useState(false);

    const idleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withRepeat(
                        withSequence(
                            withDelay(
                                defaultDelay,
                                withTiming(-jumpHeight, {
                                    duration: 300,
                                    easing: Easing.bezier(0.3, 0.9, 0.9, 1),
                                })
                            ),
                            withTiming(0, {
                                duration: 300,
                                easing: Easing.bezier(0.1, 0, 0.7, 0.2),
                            })
                        ),
                        0,
                        false
                    ),
                },
                {
                    scaleY: withRepeat(
                        withSequence(
                            withDelay(
                                defaultDelay,
                                withTiming(maxScale, {
                                    duration: 300,
                                    easing: Easing.in,
                                })
                            ),
                            withTiming(minScale, {
                                duration: 300,
                                easing: Easing.ease,
                            })
                        ),
                        0,
                        false
                    ),
                },
                {
                    rotate: withRepeat(
                        withSequence(
                            withDelay(
                                defaultDelay + defaultRotationDelay,
                                withTiming(`90deg`, {
                                    duration: 600 - defaultRotationDelay,
                                    easing: Easing.in,
                                })
                            ),
                            withDelay(
                                defaultDelay + defaultRotationDelay,
                                withTiming(`180deg`, {
                                    duration: 600 - defaultRotationDelay,
                                    easing: Easing.in,
                                })
                            ),
                            withDelay(
                                defaultDelay + defaultRotationDelay,
                                withTiming(`270deg`, {
                                    duration: 600 - defaultRotationDelay,
                                    easing: Easing.in,
                                })
                            ),
                            withDelay(
                                defaultDelay + defaultRotationDelay,
                                withTiming(`360deg`, {
                                    duration: 600 - defaultRotationDelay,
                                    easing: Easing.in,
                                })
                            ),
                            withTiming("0deg", {
                                duration: 0,
                            })
                        ),
                        0,
                        false
                    ),
                },
            ],
        };
    });

    const spinStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withSequence(
                        withTiming(-jumpHeight, {
                            duration: 375,
                            easing: Easing.bezier(0.3, 0.9, 0.9, 1),
                        }),
                        withTiming(0, {
                            duration: 375,
                            easing: Easing.bezier(0.1, 0, 0.7, 0.2),
                        })
                    ),
                },
                {
                    rotate: withSequence(
                        withTiming("0deg", { duration: 0 }),
                        withTiming(`720deg`, {
                            duration: 750,
                            easing: Easing.ease,
                        })
                    ),
                },
                {
                    scale: withRepeat(
                        withSequence(
                            withTiming(1, { duration: 0 }),
                            withTiming(1.25, {
                                duration: 450,
                                easing: Easing.in,
                            }),
                            withTiming(1, {
                                duration: 300,
                                easing: Easing.in,
                            })
                        ),
                        1,
                        true
                    ),
                },
            ],
        };
    });

    useEffect(() => {
        // if (!props.randomUserSpinning) return;
        // setSpinning(true);
        // setTimeout(() => {
        //     console.log("hallo");
        //     setSpinning(false);
        // }, defaultDelay / 10);
    }, [props.randomUserSpinning]);

    const getPath = num => {
        let out;
        switch (num) {
            case 1:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM250,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;
            case 2:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM150,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;
            case 3:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM250,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM250,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM250,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;
            case 4:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM150,387.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM150,187.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,387.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,187.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;
            case 5:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM150,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM150,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM250,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;
            case 6:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM150,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM150,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM150,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;

            default:
                out =
                    "M400,0H100C44.77,0,0,44.77,0,100v300c0,55.23,44.77,100,100,100h300c55.23,0,100-44.77,100-100V100c0-55.23-44.77-100-100-100ZM150,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM150,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM150,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,412.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,287.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5ZM350,162.5c-20.71,0-37.5-16.79-37.5-37.5s16.79-37.5,37.5-37.5,37.5,16.79,37.5,37.5-16.79,37.5-37.5,37.5Z";
                break;
        }
        return out;
    };

    return (
        <View style={props.style}>
            <Animated.View
                style={[
                    {
                        transform: [
                            { scale: 1 },
                            { rotate: `0deg` },
                            { translateY: 0 },
                        ],
                    },
                    spinning ? spinStyle : idleStyle,
                ]}>
                <Svg style={props.style} viewBox="0 0 500 500">
                    <Path fill={props.fill} d={getPath(number)} />
                </Svg>
            </Animated.View>
        </View>
    );
}
