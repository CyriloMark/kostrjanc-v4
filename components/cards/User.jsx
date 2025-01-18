import React from "react";

import { View, Text, StyleSheet, Pressable, Image } from "react-native";

import * as style from "../../styles";

export default function User(props) {
    return (
        <View style={props.style}>
            <Pressable
                style={[styles.userContainer, style.Psm]}
                onPress={props.onPress}>
                <View style={styles.userPbContainer}>
                    <Image
                        source={{
                            uri: props.user.pbUri,
                        }}
                        style={styles.userPb}
                        resizeMode="cover"
                        resizeMethod="auto"
                    />
                </View>
                <Text
                    style={[
                        style.Tmd,
                        style.tWhite,
                        {
                            marginLeft: style.defaultMmd,
                            fontFamily: "Barlow_Bold",
                        },
                    ]}>
                    {props.user.name}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    userPbContainer: {
        aspectRatio: 1,
        width: 48,
        height: 48,
        borderRadius: 100,

        overflow: "visible",
        justifyContent: "center",

        shadowColor: style.colors.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.33,
        shadowRadius: 10,
    },
    userPb: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
});
