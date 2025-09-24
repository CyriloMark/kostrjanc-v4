import React from "react";
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    Image,
    Dimensions,
} from "react-native";

import * as s from "../../styles";

export default function GroupElement({ style, group, onPress, k, active }) {
    return (
        <View style={style} key={k}>
            <Pressable
                style={[styles.groupSelectElement, s.oHidden]}
                onPress={onPress}>
                {/* Group Image */}
                <View
                    style={[
                        styles.groupSelectElementImgContainer,
                        s.oHidden,
                        active
                            ? {
                                  borderColor: s.colors.red,
                                  ...s.border,
                              }
                            : null,
                    ]}>
                    <Image style={s.allMax} source={{ uri: group.imgUri }} />
                </View>

                {/* Group Name */}
                <Text
                    style={[
                        active ? s.tRed : s.tWhite,
                        s.TsmRg,
                        styles.groupSelectTextContainer,
                    ]}>
                    {group.name}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    groupSelectElement: {},
    groupSelectElementImgContainer: {
        aspectRatio: 4 / 5,
        borderRadius: 10,
        maxWidth: Math.min(Dimensions.get("screen").width / 3, 128),
    },
    groupSelectTextContainer: {
        fontFamily: "Barlow_Bold",
        marginTop: s.defaultMsm,
        textAlign: "center",
        maxWidth: Math.min(Dimensions.get("screen").width / 3, 128),
    },
});
