import React, { useEffect } from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

export default function GroupSelect({ activeGroup, openGroupSelect }) {
    return (
        <Pressable
            style={[style.allCenter, styles.container]}
            onPress={openGroupSelect}>
            <Text
                style={[
                    style.Tmd,
                    style.tWhite,
                    { fontFamily: "Barlow_Bold" },
                    styles.textShadow,
                ]}>
                {getLangs("landing_group_selectgroup")}
            </Text>

            {/* Active Group */}
            <View style={[styles.activeGroupContainer, style.allCenter]}>
                <Text style={[style.Tmd, style.tWhite]}>{"("}</Text>
                <View style={[styles.groupImgShadow, style.allCenter]}>
                    <View
                        style={[
                            styles.groupImgContainer,
                            style.allMax,
                            style.oHidden,
                            style.bgWhite,
                        ]}>
                        <Image
                            style={[style.allMax]}
                            source={{ uri: activeGroup.groupData.imgUri }}
                        />
                    </View>
                </View>
                <Text style={[style.tWhite, style.Tmd, styles.textShadow]}>
                    {activeGroup.id === 0
                        ? "Powšitkowne"
                        : activeGroup.groupData.name}
                    {")"}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 20,
        flexDirection: "row",
    },

    activeGroupContainer: {
        marginLeft: style.defaultMmd,
        flexDirection: "row",
    },
    groupImgContainer: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 10,
    },
    groupImgShadow: {
        marginRight: style.defaultMsm,
        maxWidth: 28,
        maxHeight: 28,
        flex: 1,
        aspectRatio: 1,

        shadowColor: style.colors.blue,
        shadowOffset: {
            x: 0,
            y: 0,
        },
        shadowRadius: 10,
    },
    textShadow: {
        textShadowOffset: {
            height: 0,
            width: 0,
        },
        textShadowRadius: 5,
        textShadowColor: style.colors.black,
        padding: 2,
    },
});
