import React, { useEffect, useState } from "react";
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
import { Path, Rect, Svg } from "react-native-svg";
import { useVideoPlayer, VideoView } from "expo-video";
import { getLangs } from "../../constants/langs";

import SVG_Play from "../../assets/svg/Play";
import SVG_Pause from "../../assets/svg/Pause";

export default function TutorialView({ visible, onClose, data }) {
    const playButtonOpacity = useSharedValue(1);

    const [playing, setPlaying] = useState(false);
    const player = useVideoPlayer(data.uri, player => {
        player.loop = true;
    });

    const onToggle = () => {
        if (playing) {
            playButtonOpacity.value = withTiming(1, {
                duration: 250,
                easing: Easing.linear,
            });

            setPlaying(false);
            player.pause();
        } else {
            playButtonOpacity.value = withDelay(
                1000,
                withTiming(0, {
                    duration: 500,
                    easing: Easing.linear,
                })
            );
            setPlaying(true);
            player.play();
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
                    <VideoView
                        nativeControls={false}
                        player={player}
                        style={style.allMax}
                    />
                    <Animated.View
                        style={[styles.playButtonContainer, playButtonStyle]}>
                        {playing ? (
                            // Pause
                            <SVG_Pause
                                style={styles.playButton}
                                fill={style.colors.white}
                            />
                        ) : (
                            // Play
                            <SVG_Play
                                style={styles.playButton}
                                fill={style.colors.white}
                            />
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
