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
                <Text style={[style.tWhite, style.Tmd, {}]}>
                    {activeGroup.id === -1
                        ? "Powšitkowne"
                        : activeGroup.groupData.name}
                </Text>
                <Text style={[style.Tmd, style.tWhite]}>{")"}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
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
});
