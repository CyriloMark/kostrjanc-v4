import React from "react";
import { View, Image } from "react-native";

import * as style from "../styles";

import BackHeader from "../components/BackHeader";

export default function ImageFullscreen({ navigation, route }) {
    const { uri } = route.params;

    return (
        <View style={[style.allMax, style.bgBlack]}>
            <BackHeader onBack={() => navigation.goBack()} title="" />

            <Image
                source={{ uri: uri }}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                }}
                resizeMode="contain"
            />
        </View>
    );
}
