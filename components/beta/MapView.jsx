import React from "react";
import { View, Pressable, Text } from "react-native";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

export default function MapView(props) {
    return (
        <Pressable {...props}>
            <View style={[style.allMax, style.allCenter, style.bgBlue]}>
                <Text style={[style.TlgBd, style.tWhite]}>
                    {getLangs("no_map")}
                </Text>
            </View>
        </Pressable>
    );
}

export function Marker(props) {
    return null;
}
