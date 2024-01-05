import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from "react-native-maps";
import { mapStylesDefault } from "../../constants/event";

import SVG_Pin from "../../assets/svg/Pin3.0";

export default function EventPreview({ style, onPress, data }) {
    return (
        <View style={style}>
            <Pressable
                style={[styles.container, s.oHidden, s.allCenter]}
                onPress={onPress}>
                <MapView
                    style={s.allMax}
                    accessible={false}
                    focusable={false}
                    rotateEnabled={false}
                    zoomEnabled={false}
                    provider={PROVIDER_DEFAULT}
                    customMapStyle={mapStylesDefault}
                    initialRegion={data.geoCords}
                    pitchEnabled={false}
                    onPress={onPress}
                    userInterfaceStyle="dark"
                    scrollEnabled={false}>
                    <Marker
                        coordinate={data.geoCords}
                        style={{ transform: [{ translateY: -16 }] }}
                        focusable={false}
                        draggable={false}>
                        <SVG_Pin fill={s.colors.red} style={styles.pin} />
                    </Marker>
                </MapView>
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
        zIndex: 99,
        height: 32,
        width: 32,
        ...s.boxShadow,
    },
});
