import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from "react-native-maps";
import Map from "../event/Map";

import SVG_Pin from "../../assets/svg/Pin3.0";

export default function EventPreview({ style, onPress, data }) {
    return (
        <View style={style}>
            <Pressable
                style={[styles.container, s.oHidden, s.allCenter]}
                onPress={onPress}>
                <Map
                    style={s.allMax}
                    accessible={false}
                    onPress={onPress}
                    initialRegion={data.geoCords}
                    title={""}
                    marker={true}
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
        position: "relative",
    },

    pinContainer: {
        position: "absolute",
        bottom: s.defaultMsm,
        right: s.defaultMsm,
    },
    pin: {
        zIndex: 99,
        height: 32,
        width: 32,
        ...s.boxShadow,
    },
});
