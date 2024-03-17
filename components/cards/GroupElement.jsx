import React, { useState, useEffect } from "react";
import { View, Pressable, Text, StyleSheet, Image } from "react-native";

import * as s from "../../styles";

import { ref, child, getDatabase, get } from "firebase/database";

import { LinearGradient } from "expo-linear-gradient";

import { Group_Placeholder } from "../../constants/content/PlaceholderData";
import {
    ForYou_Group,
    General_Group,
    Challenge_Group,
} from "../../constants/content/GroupData";
import { getCurrentLanguage, getLangs } from "../../constants/langs";

export default function GroupElement({ groupId, active, style, press }) {
    const [group, setGroup] = useState(Group_Placeholder);

    const loadGroup = () => {
        get(child(ref(getDatabase()), `groups/${groupId}`))
            .then(groupSnap => {
                if (groupSnap.exists()) {
                    const groupData = groupSnap.val();
                    if (!groupData.isBanned)
                        setGroup({
                            ...groupData,
                            isDefaultGroup: false,
                        });
                }
            })
            .catch(error =>
                console.log(
                    "error loadGroup get",
                    "comps/cards/GroupElement.jsx",
                    error.code
                )
            );
    };

    const getCorrectUserAmtLang = amt => {
        let output = "";
        switch (getCurrentLanguage()) {
            case 2:
                output = "Benutzer";
                break;
            default:
                switch (amt) {
                    case 1:
                        output = "wužiwar";
                        break;
                    case 2:
                        output = "wužiwarjej";
                        break;
                    case (3, 4):
                        output = "wužiwarjo";
                        break;
                    default:
                        output = "wužiwarjow";
                        break;
                }
                break;
        }
        return output;
    };

    useEffect(() => {
        if (groupId === 0) setGroup(General_Group);
        else if (groupId === 1) setGroup(ForYou_Group);
        else if (groupId === 2) setGroup(Challenge_Group);
        else loadGroup();
    }, []);

    return (
        <View style={style}>
            <Pressable
                style={[styles.container, s.oHidden]}
                onPress={() => press(group)}>
                <Image
                    resizeMethod="resize"
                    resizeMode="cover"
                    style={s.allMax}
                    source={{
                        uri: group.imgUri,
                    }}
                />

                <View style={[s.allMax, styles.contentContainer]}>
                    <LinearGradient
                        colors={[
                            "transparent",
                            active ? s.colors.red : s.colors.black,
                        ]}
                        style={[styles.contentInnerContainer, s.pH]}>
                        <Text style={[s.tWhite, s.TlgBd]}>{group.name}</Text>
                        <Text
                            style={[
                                s.tWhite,
                                s.TsmRg,
                                {
                                    marginVertical: s.defaultMsm,
                                    textAlign: "center",
                                },
                            ]}>
                            {!group.isDefaultGroup
                                ? group.members.length
                                : String.fromCharCode(8734)}{" "}
                            {getCorrectUserAmtLang(
                                !group.isDefaultGroup ? group.members.length : 0
                            )}
                            {getLangs("groups_membersingroup")}
                        </Text>
                    </LinearGradient>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 4 / 5,
        borderRadius: 10,
    },

    contentContainer: {
        position: "relative",
        flex: 1,
        justifyContent: "flex-end",
    },
    contentInnerContainer: {
        width: "100%",
        aspectRatio: 1,
        justifyContent: "flex-end",
        paddingVertical: s.Pmd.paddingVertical,
    },
});
