import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import MapView from "react-native-maps";

import SVG_Pin from "../../assets/svg/Pin";
import { getAuth } from "firebase/auth";

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

                {/* Pin Container */}

                {/*data.checks.includes(getAuth().currentUser.uid) ?
                    <View style={styles.pinContainer}>
                        <SVG_Pin style={[styles.pin]} fill={s.colors.black} />
                    </View> : null
    */}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
        backgroundColor: "red",
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
