import React, { useState, useRef } from "react";
import { View, Image, StyleSheet } from "react-native";

import * as style from "../styles";

import BackHeader from "../components/BackHeader";

export const clamp = (value, min, max) => {
    "worklet";

    return Math.min(Math.max(min, value), max);
};

import {
    PanGestureHandler,
    PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const _minScale = 1;
const _maxScale = 5;

export default function ImageFullscreen({ navigation, route }) {
    const { uri } = route.params;

    const panRef = useRef();
    const pinchRef = useRef();

    const scale = useSharedValue(1);
    const initialFocalX = useSharedValue(0);
    const initialFocalY = useSharedValue(0);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const [state, setState] = useState({
        centerX: 0,
        centerY: 0,
    });

    const panHandler = useAnimatedGestureHandler({
        onActive: event => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        },
        onFinish: () => {
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
        },
    });

    const pinchHandler = useAnimatedGestureHandler({
        onStart: event => {
            initialFocalX.value = event.focalX;
            initialFocalY.value = event.focalY;
        },
        onActive: event => {
            // onStart: focalX & focalY result both to 0 on Android
            if (initialFocalX.value === 0 && initialFocalY.value === 0) {
                initialFocalX.value = event.focalX;
                initialFocalY.value = event.focalY;
            }
            scale.value = clamp(event.scale, _minScale, _maxScale);
            focalX.value =
                (state.centerX - initialFocalX.value) * (scale.value - 1);
            focalY.value =
                (state.centerY - initialFocalY.value) * (scale.value - 1);
        },
        onFinish: () => {
            scale.value = withTiming(1);
            focalX.value = withTiming(0);
            focalY.value = withTiming(0);
            initialFocalX.value = 0;
            initialFocalY.value = 0;
        },
    });

    const onLayout = ({
        nativeEvent: {
            layout: { x, y, width, height },
        },
    }) => {
        setState(current => ({
            ...current,
            centerX: x + width / 2,
            centerY: y + height / 2,
        }));
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { translateX: focalX.value },
            { translateY: focalY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <View style={[style.allMax, style.bgBlack]}>
            <BackHeader
                onBack={() => navigation.goBack()}
                title=""
                showReload={false}
            />

            <View style={styles.imageContainer}>
                <PinchGestureHandler
                    ref={pinchRef}
                    simultaneousHandlers={[panRef]}
                    onGestureEvent={pinchHandler}>
                    <Animated.View style={style.container}>
                        <PanGestureHandler
                            ref={panRef}
                            simultaneousHandlers={[pinchRef]}
                            onGestureEvent={panHandler}>
                            <Animated.View
                                style={[style.oHidden, styles.content]}
                                onLayout={onLayout}>
                                <AnimatedImage
                                    style={[style.allMax, animatedStyle]}
                                    source={{ uri }}
                                    resizeMode="contain"
                                />
                            </Animated.View>
                        </PanGestureHandler>
                    </Animated.View>
                </PinchGestureHandler>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexGrow: 1,
        position: "relative",
    },
    imageContainer: {
        position: "absolute",
        zIndex: 1,
        ...style.allMax,
    },
});
