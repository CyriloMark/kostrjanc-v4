import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Image,
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
import BottomTransitionBar from "../BottomTransitionBar";

const testAudioSource = require("../../assets/test-bamborak.mp3");

export default function ContextMenu({ visible, onClose, text }) {
    const visibleRef = useRef(visible);

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

    const [generatedTTS, setGeneratedTTS] = useState(false);
    const [generatingTTS, setGeneratingTTS] = useState(false);
    const [playing, setPlaying] = useState(false);

    const [generatedSotra, setGeneratedSotra] = useState(false);
    const [generatingSotra, setGeneratingSotra] = useState(false);
    const [sotraText, setSotraText] = useState(null);

    const [estimatedTime, setEstimatedTime] = useState(0);

    const player = useAudioPlayer({
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/bamborak-2.mp3?alt=media&token=dfb64013-f25a-4452-a9f6-5a2195099a01",
    });
    const status = useAudioPlayerStatus(player);

    const _generateTTS = async () => {
        if (generatingTTS || generatedTTS) return;
        setGeneratingTTS(true);

        setEstimatedTime(calculateEstimatedGenerationTime(text));

        await generate(text)
            .then(fileUrl => {
                if (visibleRef.current) {
                    player.replace(fileUrl);
                    setGeneratedTTS(true);
                    togglePlay();
                }
            })
            .catch(error =>
                console.log("error", "_generate ContextMenu.jsx", error)
            )
            .finally(() => setGeneratingTTS(false));
    };

    const _generateSotra = async () => {
        if (generatingSotra || generatedSotra) return;
        setGeneratingSotra(true);

        // Testwise Text
        // setSotraText(
        //     "Letzte Augustwoche habe ich an der Slawistik-Schule teilgenommen, welche die philologische Fakultät MSU für Schüler organisiert. Dort gibt es Vorträge über alles das Slawentum zu tun hat, und auch winzige Kurse recht aller slawischen Sprachen. Schon letztes Jahr habe ich dort einen Obersorbischkurs geleitet, aber es war online und ich hatte nur eine Schülerin. In diesem Jahr war alles offline, und Sorbisch war sogar eine der populärsten Sprachen: ich hatte schon etwa 7 Lernende."
        // );
        setGeneratedSotra(true);
    };

    useEffect(() => {
        visibleRef.current = visible;

        if (!visible) {
            player.pause();
            return;
        }
        setEstimatedTime(0);

        setGeneratedTTS(false);
        setGeneratedSotra(false);
        setGeneratingTTS(false);
        setGeneratingSotra(false);
        setSotraText(null);
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
            <View style={[style.allMax, { justifyContent: "flex-end" }]}>
                {visible ? (
                    <Pressable
                        onPress={onClose}
                        style={[
                            style.allMax,
                            { backgroundColor: "transparent" },
                        ]}
                    />
                ) : null}
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
                    <View style={[styles.innerContainer, style.Plg]}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text
                                style={[
                                    style.Tmd,
                                    { fontFamily: "Barlow_Bold" },
                                    style.tBlue,
                                ]}>
                                {getLangs("contextmenu_title")}
                            </Text>
                            <Pressable onPress={onClose}>
                                <CloseFilled
                                    style={styles.close}
                                    fill={style.colors.blue}
                                />
                            </Pressable>
                        </View>

                        {/* Text Area */}
                        <View
                            style={[
                                styles.textContainer,
                                style.oHidden,
                                { position: "relative" },
                            ]}>
                            <ScrollView
                                scrollEnabled
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: 24,
                                }} // optional, für Platz am Ende sorgt
                                style={{ flexGrow: 1 }}>
                                {/* Original */}
                                <View
                                    style={{
                                        marginTop: style.defaultMmd,
                                    }}>
                                    <Text style={[style.TsmRg, style.tBlue]}>
                                        {getLangs("contextmenu_original")}
                                    </Text>
                                    <Text style={[style.TlgRg, style.tWhite]}>
                                        "{text}"
                                    </Text>
                                </View>

                                {/* Translated */}
                                {sotraText || generatingSotra ? (
                                    <View
                                        style={{
                                            marginTop: style.defaultMlg,
                                        }}>
                                        <View
                                            style={
                                                styles.sotraTextTitleContainer
                                            }>
                                            <Image
                                                style={styles.sotraTextLogo}
                                                resizeMode="contain"
                                                source={require("../../assets/img/sotra_logo.png")}
                                            />
                                            <Text
                                                style={[
                                                    style.TsmRg,
                                                    style.tBlue,
                                                ]}>
                                                {getLangs(
                                                    "contextmenu_translation"
                                                )}
                                            </Text>
                                        </View>
                                        <Text
                                            style={[style.TlgRg, style.tWhite]}>
                                            "
                                            {!generatingSotra ? (
                                                sotraText
                                            ) : (
                                                <Text>
                                                    {" "}
                                                    <ActivityIndicator
                                                        size={"small"}
                                                        color={
                                                            style.colors.white
                                                        }
                                                    />{" "}
                                                </Text>
                                            )}
                                            "
                                        </Text>
                                    </View>
                                ) : null}
                            </ScrollView>

                            <BottomTransitionBar
                                inverted
                                style={{
                                    top: 0,
                                }}
                            />
                            <BottomTransitionBar style={{ bottom: 0 }} />
                        </View>

                        {/* TTS Button Container */}
                        <View style={[styles.tts_buttonContainer]}>
                            <ActionButton
                                onPress={_generateTTS}
                                checked={!generatedTTS}
                                style={[styles.button, { flex: 1 }]}
                                content={
                                    <Text
                                        style={[
                                            style.Tmd,
                                            style.tBlack,
                                            {
                                                fontFamily: "Barlow_Bold",
                                            },
                                        ]}>
                                        {getLangs("contextmenu_tts_generate")}
                                        {estimatedTime ? (
                                            <Text style={style.Tmd}>
                                                {` (~${estimatedTime} sek)`}
                                            </Text>
                                        ) : null}
                                    </Text>
                                }
                            />
                            <ActionButton
                                checked={generatedTTS}
                                aspect={1}
                                onPress={togglePlay}
                                style={[
                                    styles.button,
                                    {
                                        marginHorizontal: style.defaultMsm,
                                    },
                                ]}
                                content={
                                    generatingTTS ? (
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

                        {/* Sotra Button Container */}
                        <View style={[styles.sotra_buttonContainer]}>
                            <ActionButton
                                onPress={_generateSotra}
                                checked={!generatedSotra}
                                style={[styles.button]}
                                content={
                                    <View
                                        style={
                                            styles.sotraButtonContentContainer
                                        }>
                                        <Image
                                            resizeMode="contain"
                                            style={styles.sotraLogo}
                                            source={require("../../assets/img/sotra_logo.png")}
                                        />
                                        <Text
                                            style={[
                                                style.Tmd,
                                                style.tBlack,
                                                {
                                                    fontFamily: "Barlow_Bold",
                                                },
                                            ]}>
                                            {getLangs(
                                                "contextmenu_sotra_generate"
                                            )}
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </Animated.View>
            </View>
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

    textContainer: {
        width: "100%",
        maxHeight: Dimensions.get("screen").height * 0.5,
    },
    sotraTextTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    sotraTextLogo: {
        aspectRatio: 2,
        width: 22,
        marginRight: style.defaultMsm,
    },

    tts_buttonContainer: {
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

    sotra_buttonContainer: {
        marginTop: style.defaultMsm,
        width: "100%",
    },
    sotraButtonContentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    sotraLogo: {
        aspectRatio: 2,
        width: 32,
        marginRight: style.defaultMsm,
    },
});
