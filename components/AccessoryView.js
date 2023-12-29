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

import * as style from "../styles";

import Animated, {
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from "react-native-reanimated";

import SVG_Return from "../assets/svg/Return";

import { LinearGradient } from "expo-linear-gradient";

const letters = ["č", "ć", "ě", "ł", "ń", "ó", "ř", "š", "ž", "ź"];
const letters_caps = ["Č", "Ć", "ě", "Ł", "ń", "ó", "ř", "Š", "Ž", "ź"];

export default function AccessoryView({ nativeID, onElementPress }) {
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
        capsRotation.value = withTiming(!caps ? 0 : 180, {
            duration: 250,
            easing: Easing.bezier(0.33, 0, 0.66, 1),
        });
    }, [caps]);
    //#endregion

    if (Platform.OS !== "ios") return null;

    return (
        <InputAccessoryView
            nativeID={nativeID}
            backgroundColor={"transparent"}
            style={{
                width: "100%",
            }}>
            <View style={[styles.outerContainer, style.oHidden]}>
                <View style={[style.bgBlack, styles.container, style.oHidden]}>
                    <Pressable
                        style={[style.allCenter, styles.capsButtonContainer]}
                        onPress={() =>
                            setCaps(prev => {
                                return !prev;
                            })
                        }>
                        <Animated.View style={capsButtonStyles}>
                            <SVG_Return
                                rotation={270}
                                style={styles.capsButton}
                                fill={style.colors.blue}
                            />
                        </Animated.View>
                    </Pressable>
                    <View style={[{ flex: 0.9 }, style.oHidden]}>
                        <ScrollView
                            style={[styles.layer]}
                            contentContainerStyle={[
                                styles.layerInner,
                                style.pH,
                            ]}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="none"
                            showsVerticalScrollIndicator={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {caps
                                ? letters_caps.map((letter, key) => (
                                      <Pressable
                                          key={key}
                                          style={[
                                              style.pH,
                                              style.allCenter,
                                              key !== 0
                                                  ? {
                                                        marginLeft:
                                                            style.defaultMmd,
                                                    }
                                                  : null,
                                          ]}
                                          onPress={() => {
                                              setCaps(false);
                                              onElementPress(letter);
                                          }}>
                                          <Text
                                              style={[
                                                  style.TlgBd,
                                                  style.tWhite,
                                              ]}>
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
                                              key !== 0
                                                  ? {
                                                        marginLeft:
                                                            style.defaultMmd,
                                                    }
                                                  : null,
                                          ]}
                                          onPress={() =>
                                              onElementPress(letter)
                                          }>
                                          <Text
                                              style={[
                                                  style.TlgBd,
                                                  style.tWhite,
                                              ]}>
                                              {letter}
                                          </Text>
                                      </Pressable>
                                  ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </InputAccessoryView>
    );
}

export function AccessoryView2({ nativeID, onElementPress }) {
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
            damping: 15,
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
                                fill={style.colors.blue}
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
                                  onPress={() => {
                                      setCaps(false);
                                      onElementPress(letter);
                                  }}>
                                  <Text style={[style.TlgBd, style.tWhite]}>
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
                                  <Text style={[style.TlgBd, style.tWhite]}>
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
    outerContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: style.Pmd.paddingHorizontal,
        ...style.pV,
    },
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        padding: style.Psm.paddingVertical,
        borderRadius: 25,
    },
    layer: {
        maxHeight: 32,
        width: "100%",
    },
    layerInner: {
        flexDirection: "row",
        alignItems: "center",
    },

    capsButtonContainer: {
        flex: 0.1,
    },
    capsButton: {
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },
});
