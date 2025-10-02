import React, { useEffect, useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Platform,
    Alert,
} from "react-native";

import * as style from "../../styles";

import { ref, set, getDatabase } from "firebase/database";

import { Ban_Placeholder } from "../../constants/content/PlaceholderData";
import { getData } from "../../constants/storage";
import { getLangs } from "../../constants/langs";
import { getUnsignedTranslationText } from "../../constants/content/translation";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";

let banning = false;

export default function Ban({ navigation, route }) {
    const { item, type, id } = route.params;

    const [banData, setBanData] = useState(Ban_Placeholder);

    const itemType = () => {
        switch (type) {
            case 0:
                return getLangs("report_post");
            case 1:
                return getLangs("report_event");
            case 2:
                return getLangs("report_user");
            default:
                return "";
        }
    };

    useEffect(() => {
        banning = false;
    }, []);

    const ban = () => {
        if (banning) return;

        Alert.alert(
            `${getLangs("banelement_sub_0")} "${
                type === 2 ? item.name : item.title
            }" ${getLangs("banelement_sub_1")}`,
            type !== 2
                ? `${itemType()} ${getLangs("banelement_ban_sub_0")}`
                : getLangs("banelement_ban_sub_1"),
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
                        banning = true;

                        const db = getDatabase();

                        let path = "";
                        switch (type) {
                            case 0:
                                path = `posts/${id}/isBanned`;
                                break;
                            case 1:
                                path = `events/${id}/isBanned`;
                                break;
                            case 2:
                                path = `users/${id}/isBanned`;
                                break;
                            default:
                                break;
                        }

                        if (path.length === 0) {
                            Alert.alert(
                                getLangs("banelement_error_title"),
                                getLangs("banelement_error_sub"),
                                [
                                    {
                                        text: "Ok",
                                        style: "cancel",
                                        isPreferred: true,
                                    },
                                ]
                            );
                            return;
                        }
                        // Ban Item
                        set(ref(db, path), true).catch(error =>
                            console.log(
                                "error pages/interaction/Ban.jsx",
                                "ban set item banned",
                                error.code
                            )
                        );

                        if (type !== 2) return;

                        // Ban Posts
                        if (item.posts ? true : false)
                            item.posts.forEach(e =>
                                set(ref(db, `posts/${e}/isBanned`), true)
                                    .catch(error =>
                                        console.log(
                                            "error pages/interaction/Ban.jsx",
                                            "ban set user posts banned",
                                            error.code
                                        )
                                    )
                                    .finally(() => {
                                        Alert.alert(
                                            getLangs(
                                                "banelement_success_title"
                                            ),
                                            "",
                                            [
                                                {
                                                    isPreferred: true,
                                                    text: "Ok",
                                                    style: "cancel",
                                                    onPress: () =>
                                                        navigation.goBack(),
                                                },
                                            ]
                                        );
                                    })
                            );

                        // Ban Events
                        if (item.events ? true : false)
                            item.events.forEach(e =>
                                set(ref(db, `events/${e}/isBanned`), true)
                                    .catch(error =>
                                        console.log(
                                            "error pages/interaction/Ban.jsx",
                                            "ban set user events banned",
                                            error.code
                                        )
                                    )
                                    .finally(() => {
                                        Alert.alert(
                                            getLangs(
                                                "banelement_success_title"
                                            ),
                                            "",
                                            [
                                                {
                                                    isPreferred: true,
                                                    text: "Ok",
                                                    style: "cancel",
                                                    onPress: () =>
                                                        navigation.goBack(),
                                                },
                                            ]
                                        );
                                    })
                            );
                    },
                },
            ]
        );
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title={getLangs("banelement_title")}
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
                    {
                        //#region Content Title
                    }
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        <Text style={style.TquoteTitle}>„</Text>
                        {type === 2
                            ? item.name
                            : getUnsignedTranslationText(item.title)}
                        <Text style={style.TquoteTitle}>“</Text> ({itemType()}){" "}
                        {getLangs("banelement_sub_1")}
                    </Text>

                    {
                        //#region Description
                    }
                    <View style={[styles.sectionContainer, style.pH]}>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginBottom: style.defaultMsm },
                            ]}>
                            {getLangs("report_additionalinfomation")}
                        </Text>
                        <TextField
                            placeholder={getLangs(
                                "input_placeholder_description"
                            )}
                            value={banData.description}
                            inputAccessoryViewID={
                                "ban_Description_InputAccessoryViewID"
                            }
                            maxLength={512}
                            onChangeText={val => {
                                setBanData({
                                    ...banData,
                                    description: val,
                                });
                            }}
                        />
                    </View>

                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton onPress={ban} checked />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <AccessoryView
                onElementPress={l => {
                    setBanData(prev => {
                        return {
                            ...prev,
                            description: prev.description + l,
                        };
                    });
                }}
                nativeID={"ban_Description_InputAccessoryViewID"}
            />
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
