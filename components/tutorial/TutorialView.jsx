import React, { useEffect, useRef, useState } from "react";
import { View, Modal, StyleSheet, Text, Pressable } from "react-native";

import * as style from "../../styles";

import EnterButton from "../auth/EnterButton";

import Animated, {
    Easing,
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from "react-native-reanimated";
import { Path, Polygon, Rect, Svg } from "react-native-svg";
import { Video, ResizeMode } from "expo-av";
import { getLangs } from "../../constants/langs";

export default function TutorialView({ visible, onClose, data }) {
    const videoRef = useRef(null);

    const [playing, setPlaying] = useState(false);

    const playButtonOpacity = useSharedValue(1);

    const onToggle = () => {
        if (playing) {
            playButtonOpacity.value = withTiming(1, {
                duration: 250,
                easing: Easing.linear,
            });

            setPlaying(false);
            videoRef.current.pauseAsync();
        } else {
            playButtonOpacity.value = withDelay(
                1000,
                withTiming(0, {
                    duration: 500,
                    easing: Easing.linear,
                })
            );
            setPlaying(true);
            videoRef.current.playAsync();
        }
    };

    const playButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: playButtonOpacity.value,
        };
    });

    useEffect(() => {
        setPlaying(false);
    }, [visible]);

    return (
        <Modal
            animationType="slide"
            visible={visible}
            // transparent
            onRequestClose={onClose}
            presentationStyle="pageSheet">
            <View style={[styles.container, style.Psm, style.bgBlack]}>
                {/* Line */}
                <View style={[styles.closingLine, style.bgBlue]} />

                {/* Titel */}
                <View style={[styles.titleContainer]}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Tutorial: {getLangs(data.title_id)}
                    </Text>
                </View>

                {/* Content */}
                <Pressable
                    style={[
                        styles.contentContainer,
                        style.bgBlue,
                        style.allCenter,
                        style.border,
                        style.oHidden,
                    ]}
                    onPress={onToggle}>
                    <Video
                        source={{ uri: data.uri }}
                        ref={videoRef}
                        useNativeControls={false}
                        isLooping
                        resizeMode={ResizeMode.CONTAIN}
                        style={style.allMax}
                    />
                    <Animated.View
                        style={[styles.playButtonContainer, playButtonStyle]}>
                        {playing ? (
                            // Pause
                            <Svg
                                viewBox="0 0 500 450"
                                style={styles.playButton}
                                fill={style.colors.white}>
                                <Rect
                                    width={175}
                                    height={400}
                                    x={25}
                                    y={25}
                                    rx={23.57}
                                    ry={23.57}
                                />
                                <Rect
                                    width={175}
                                    height={400}
                                    x={300}
                                    y={25}
                                    rx={23.57}
                                    ry={23.57}
                                />
                            </Svg>
                        ) : (
                            // Play
                            <Svg
                                viewBox="0 0 450 450"
                                style={styles.playButton}
                                fill={style.colors.white}>
                                <Path d="m411.97,204.11L59.07,27.52c-15.65-7.83-34.07,3.55-34.07,21.05v353.18c0,17.5,18.42,28.88,34.07,21.05l352.9-176.59c17.34-8.68,17.34-33.42,0-42.1Z" />
                            </Svg>
                        )}
                    </Animated.View>
                </Pressable>

                <EnterButton checked onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    },

    closingLine: {
        width: "40%",
        height: 3,
        borderRadius: 10,
        marginVertical: style.defaultMmd,
    },

    titleContainer: {
        marginTop: style.defaultMmd,
    },

    contentContainer: {
        aspectRatio: 1,
        width: "100%",
        marginVertical: style.defaultMlg,
        borderRadius: 25,
        borderColor: style.colors.sec,
    },

    playButtonContainer: {
        position: "absolute",
    },
    playButton: {
        width: 58,
        height: 58,
    },
});
