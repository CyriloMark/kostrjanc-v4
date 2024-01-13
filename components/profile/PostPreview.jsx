import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, Image } from "react-native";

import { get, getDatabase, child, ref } from "firebase/database";

import * as s from "../../styles";

export default function PostPreview({ style, onPress, data }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <Image
                    style={s.allMax}
                    source={{ uri: data.imgUri }}
                    resizeMode="cover"
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 10,
        zIndex: 2,
        position: "relative",
    },
});
