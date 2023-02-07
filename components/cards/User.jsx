import React, { useState, useEffect } from "react";

import { View, Text, StyleSheet, Pressable, Image } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as style from "../../styles";

import { User_Placeholder } from "../../constants/content/PlaceholderData";

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
                        style.TlgRg,
                        style.tWhite,
                        {
                            marginLeft: style.defaultMmd,
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
        flex: 1,
        width: "100%",
        maxWidth: 58,
        maxHeight: 58,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },
    userPb: {
        width: "100%",
        height: "100%",
    },
});
