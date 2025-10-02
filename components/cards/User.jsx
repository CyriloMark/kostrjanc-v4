import React from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
} from "react-native";

import * as s from "../../styles";
import { LinearGradient } from "expo-linear-gradient";

export default function User({ style, user, onPress }) {
    return (
        <View style={[style, styles.shadow, s.oVisible]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                {
                    //#region User Profile Img Layer
                }
                <View style={[styles.imgContainer, s.allCenter, s.allMax]}>
                    <View style={{ flex: 1 }} />
                    <Image
                        source={{
                            uri: user.pbUri,
                        }}
                        resizeMode="cover"
                        resizeMethod="auto"
                        style={{ aspectRatio: 1, flex: 2 }}
                    />
                </View>
                {
                    //#region Background Layer
                }
                <View style={[styles.gradContainer, s.allMax]}>
                    <View style={{ flex: 1 }} />
                    <LinearGradient
                        colors={[s.colors.black, "transparent"]}
                        start={{
                            x: 0,
                            y: 0,
                        }}
                        end={{
                            x: 1,
                            y: 0,
                        }}
                        style={{ flex: 2 }}
                    />
                </View>

                {
                    //#region User Name & Desc Container
                }
                <View style={[styles.textContainer, s.Plg]}>
                    <Text style={[s.tWhite, s.TlgBd]}>{user.name}</Text>
                    <Text
                        style={[s.tWhite, s.Tmd, { marginTop: s.defaultMsm }]}
                        numberOfLines={1}>
                        {user.description}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        alignSelf: "center",
        width: "80%",

        // Shadow
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: s.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        borderColor: s.colors.sec,
        borderWidth: 1,
    },
    container: {
        width: "100%",
        height: Math.min(Dimensions.get("screen").height / 8, 206),
        backgroundColor: s.colors.black,

        borderRadius: 10,
        flexDirection: "row",
        zIndex: 3,
        position: "relative",
    },

    imgContainer: {
        width: "100%",
        flexDirection: "row",
    },

    gradContainer: {
        position: "absolute",
        flexDirection: "row",
    },

    textContainer: {
        width: "80%",
        height: "100%",
        position: "absolute",

        flexDirection: "column",
        justifyContent: "center",
    },
});
