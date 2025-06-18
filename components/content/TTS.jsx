import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as style from "../../styles";

import Animated, {
    Easing,
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withDelay,
} from "react-native-reanimated";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { getLangs } from "../../constants/langs";
import generate, {
    calculateEstimatedGenerationTime,
} from "../../constants/content/tts";

import CloseFilled from "../../assets/svg/CloseFilled";
import SVG_Play from "../../assets/svg/Play";
import SVG_Pause from "../../assets/svg/Pause";
import SVG_Stop from "../../assets/svg/Stop";

import ActionButton from "./ActionButton";

const testAudioSource = require("../../assets/test-bamborak.mp3");

export default function TTS({ visible, onClose, text }) {
    //#region Opening/Closing Anim
    const bgOpacity = useSharedValue(0);

    const screenHeight = Dimensions.get("screen").height;
    const translationBg = useSharedValue(screenHeight);
    const translation = useSharedValue(screenHeight);

    const bgStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: `rgba(0,0,0,${bgOpacity.value})`,
            transform: [
                {
                    translateY: translationBg.value,
                },
            ],
        };
    });
    const boxStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: translation.value,
                },
            ],
        };
    });

    useEffect(() => {
        bgOpacity.value = withTiming(visible ? 0.5 : 0, {
            duration: 300,
            easing: Easing.linear,
        });

        if (visible) translationBg.value = withTiming(0, { duration: 0 });
        else
            translationBg.value = withDelay(
                300,
                withTiming(screenHeight, { duration: 0 })
            );

        translation.value = withTiming(visible ? 0 : screenHeight, {
            duration: 500,
            easing: Easing.bezier(0.7, 0, 0.3, 1),
        });
    }, [visible]);
    //#endregion

    const [generated, setGenerated] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [playing, setPlaying] = useState(false);

    const [estimatedTime, setEstimatedTime] = useState(0);

    const player = useAudioPlayer({
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/bamborak-2.mp3?alt=media&token=dfb64013-f25a-4452-a9f6-5a2195099a01",
    });
    const status = useAudioPlayerStatus(player);

    const _generate = async () => {
        if (generating || generated) return;
        setGenerating(true);

        setEstimatedTime(calculateEstimatedGenerationTime(text));

        await generate(text)
            .then(fileUrl => {
                player.replace(fileUrl);
                setGenerated(true);
                togglePlay();
            })
            .catch(error => console.log("error", "_generate TTS.jsx", error))
            .finally(() => setGenerating(false));
    };

    useEffect(() => {
        if (!visible) {
            player.pause();
            return;
        }
        setEstimatedTime(0);

        setGenerated(false);
        setGenerating(false);
        setPlaying(false);
    }, [visible]);

    useEffect(() => {
        if (status.didJustFinish) {
            player.pause();
            setPlaying(false);
        }
    }, [status.didJustFinish]);

    const togglePlay = () => {
        if (playing) player.pause();
        else {
            player.seekTo(0);
            player.play();
        }

        setPlaying(cur => !cur);
    };

    const bottom = useSafeAreaInsets().bottom;
    return (
        <Animated.View style={[style.allMax, styles.container, bgStyle]}>
            <Pressable
                style={[style.allMax, { justifyContent: "flex-end" }]}
                onPress={onClose}>
                <Animated.View
                    style={[
                        styles.contentContainer,
                        style.bgBlack,
                        // style.oHidden,
                        style.shadowSec,
                        {
                            paddingBottom: bottom,
                            shadowOpacity: 0.75,
                            shadowRadius: 25,
                        },
                        boxStyle,
                    ]}>
                    <Pressable
                        style={[styles.innerContainer, style.Plg]}
                        onPress={null}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text
                                style={[
                                    style.Tmd,
                                    { fontFamily: "Barlow_Bold" },
                                    style.tBlue,
                                ]}>
                                {getLangs("tts_title")}
                            </Text>
                            <Pressable onPress={onClose}>
                                <CloseFilled
                                    style={styles.close}
                                    fill={style.colors.blue}
                                />
                            </Pressable>
                        </View>

                        <Text style={[style.TlgRg, style.tWhite, styles.text]}>
                            "{text}"
                        </Text>

                        {/* Button Container */}
                        <View style={[styles.buttonContainer]}>
                            <ActionButton
                                onPress={_generate}
                                checked={!generated}
                                style={[styles.button, { flex: 1 }]}
                                content={
                                    <Text
                                        style={[
                                            style.Tmd,
                                            style.tBlack,
                                            { fontFamily: "Barlow_Bold" },
                                        ]}>
                                        {getLangs("tts_generate")}
                                        {estimatedTime ? (
                                            <Text style={style.Tmd}>
                                                {` (~${estimatedTime} sek)`}
                                            </Text>
                                        ) : null}
                                    </Text>
                                }
                            />
                            <ActionButton
                                checked={generated}
                                aspect={1}
                                onPress={togglePlay}
                                style={[
                                    styles.button,
                                    { marginHorizontal: style.defaultMsm },
                                ]}
                                content={
                                    generating ? (
                                        <ActivityIndicator
                                            size={"small"}
                                            color={style.colors.black}
                                        />
                                    ) : playing ? (
                                        <SVG_Pause
                                            style={styles.btnIcon}
                                            fill={style.colors.black}
                                        />
                                    ) : (
                                        <SVG_Play
                                            style={styles.btnIcon}
                                            fill={style.colors.black}
                                        />
                                    )
                                }
                            />
                        </View>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
    },

    contentContainer: {
        width: "100%",
        height: "auto",
        borderRadius: 25,
        position: "relative",
    },
    innerContainer: {
        width: "100%",
        minHeight: 100,
    },

    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    close: {
        aspectRatio: 1,
        width: 24,
        height: 24,
    },

    text: {
        marginTop: style.defaultMsm,
    },

    buttonContainer: {
        marginTop: style.defaultMmd,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        borderRadius: 10,
    },
    btnIcon: {
        aspectRatio: 1,
        width: 20,
        height: 20,
    },
});
