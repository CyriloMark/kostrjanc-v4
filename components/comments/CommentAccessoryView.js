import React, { useEffect, useState } from "react";
import {
    InputAccessoryView,
    StyleSheet,
    Pressable,
    Text,
    View,
    ScrollView,
    Platform,
} from "react-native";

import * as style from "../../styles";

import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";

import SVG_Return from "../../assets/svg/Return";

export default function CommentAccessoryView({
    nativeID,
    text,
    onElementPress,
}) {
    const letters = ["č", "ć", "ě", "ł", "ń", "ó", "ř", "š", "ž"];
    const letters_caps = ["Č", "Ć", "ě", "Ł", "ń", "ó", "ř", "Š", "Ž"];

    //#region caps Button
    const capsRotation = useSharedValue(0);
    const [caps, setCaps] = useState(false);

    const capsButtonStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${capsRotation.value}deg`,
                },
            ],
        };
    });

    useEffect(() => {
        capsRotation.value = withSpring(!caps ? 0 : 180, {
            stiffness: 90,
            damping: 10,
        });
    }, [caps]);

    //#endregion

    if (Platform.OS !== "ios") return null;
    return (
        <InputAccessoryView nativeID={nativeID} backgroundColor={"white"}>
            <View style={[style.bgBlack, style.Psm, styles.container]}>
                {/* Letter Layer */}
                <ScrollView
                    style={[styles.layer]}
                    contentContainerStyle={[styles.layerInner]}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="none"
                    showsVerticalScrollIndicator={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <Pressable
                        style={[style.pH, style.allCenter]}
                        onPress={() =>
                            setCaps(prev => {
                                return !prev;
                            })
                        }>
                        <Animated.View style={capsButtonStyles}>
                            <SVG_Return
                                rotation={270}
                                style={styles.capsButton}
                                fill={style.colors.sec}
                            />
                        </Animated.View>
                    </Pressable>
                    {caps
                        ? letters_caps.map((letter, key) => (
                              <Pressable
                                  key={key}
                                  style={[
                                      style.pH,
                                      style.allCenter,
                                      { marginLeft: style.defaultMmd },
                                  ]}
                                  onPress={() => onElementPress(letter)}>
                                  <Text style={[style.TlgBd, style.tBlue]}>
                                      {letter}
                                  </Text>
                              </Pressable>
                          ))
                        : letters.map((letter, key) => (
                              <Pressable
                                  key={key}
                                  style={[
                                      style.pH,
                                      style.allCenter,
                                      { marginLeft: style.defaultMmd },
                                  ]}
                                  onPress={() => onElementPress(letter)}>
                                  <Text style={[style.TlgBd, style.tBlue]}>
                                      {letter}
                                  </Text>
                              </Pressable>
                          ))}
                </ScrollView>
            </View>
        </InputAccessoryView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column-reverse",
    },
    layer: {
        maxHeight: 32,
        width: "100%",
    },
    layerInner: {
        flexDirection: "row",
        alignItems: "center",
    },
    capsButton: {
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },
});
