import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";

import * as style from "../../styles";

import { ref, set, getDatabase } from "firebase/database";

import { getLangs } from "../../constants/langs";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";

let deleting = false;

export default function Delete({ navigation, route }) {
    const { type, id } = route.params;

    const onDelete = () => {
        if (deleting) {
            console.log("already deleting");
            return;
        }
        Alert.alert(
            `${
                type === 0 ? getLangs("delete_post") : getLangs("delete_event")
            }${getLangs("delete_sub")}`,
            type === 0
                ? getLangs("delete_alert_sub_p")
                : getLangs("delete_alert_sub_e"),
            [
                {
                    text: getLangs("no"),
                    style: "cancel",
                },
                {
                    text: getLangs("yes"),
                    style: "default",
                    isPreferred: true,
                    onPress: async () => {
                        deleting = true;

                        let path = "";
                        switch (type) {
                            case 0:
                                path = `posts/${id}/isBanned`;
                                break;
                            case 1:
                                path = `events/${id}/isBanned`;
                                break;
                            default:
                                break;
                        }

                        const db = getDatabase();
                        set(ref(db, path), true)
                            .catch(error =>
                                console.log(
                                    "error pages/interaction/Delete.jsx",
                                    "error set isBanned true",
                                    error.code
                                )
                            )
                            .finally(() => {
                                deleting = false;
                                Alert.alert(
                                    getLangs("delete_successful_title"),
                                    `${
                                        type === 0
                                            ? getLangs("delete_post")
                                            : getLangs("delete_event")
                                    }${getLangs("delete_successful_sub")}`,
                                    [
                                        {
                                            text: "Ok",
                                            isPreferred: true,
                                            style: "cancel",
                                            onPress: () => {
                                                navigation.navigate(
                                                    "userProfile"
                                                );
                                            },
                                        },
                                    ]
                                );
                            });
                    },
                },
            ]
        );
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("delete_title")}
                    onBack={() => navigation.goBack()}
                    showReload={false}
                />
            </Pressable>

            <ScrollView
                style={[
                    style.container,
                    style.pH,
                    style.oVisible,
                    { marginTop: style.defaultMsm },
                ]}
                keyboardDismissMode="interactive"
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                <Text style={[style.Ttitle2, style.tWhite]}>
                    {type === 0
                        ? getLangs("delete_post")
                        : getLangs("delete_event")}
                    {getLangs("delete_sub")}
                </Text>

                <Text
                    style={[
                        { marginTop: style.defaultMmd },
                        style.Tmd,
                        style.tWhite,
                    ]}>
                    {type === 0
                        ? getLangs("delete_post")
                        : getLangs("delete_event")}
                    {getLangs("delete_hint")}
                </Text>

                <View style={[style.allCenter, styles.button]}>
                    <EnterButton onPress={onDelete} checked />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        flexDirection: "column",
    },
    button: {
        marginVertical: style.defaultMlg,
    },
});
