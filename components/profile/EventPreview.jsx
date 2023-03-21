import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import MapView from "react-native-maps";

export default function EventPreview({ style, onPress, data }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <MapView
                    style={s.allMax}
                    accessible={false}
                    focusable={false}
                    rotateEnabled={false}
                    zoomEnabled={false}
                    initialRegion={data.geoCords}
                    pitchEnabled={false}
                    onPress={onPress}
                    scrollEnabled={false}
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
    },

    pinContainer: {
        position: "absolute",
        bottom: s.defaultMsm,
        right: s.defaultMsm,
    },
    pin: {
        aspectRatio: 1,
        maxHeight: 12,
        maxWidth: 12,
    },
});
