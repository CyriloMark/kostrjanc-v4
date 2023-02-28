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

import { getAuth } from "firebase/auth";
import { ref, set, getDatabase } from "firebase/database";

import { Ban_Placeholder } from "../../constants/content/PlaceholderData";
import { getData } from "../../constants/storage";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import TextField from "../../components/TextField";
import AccessoryView from "../../components/AccessoryView";

let banning = false;

export default function Ban({ navigation, route }) {
    const { item, type, id } = route.params;

    const [banData, setBanData] = useState(Ban_Placeholder);
    const [buttonChecked, setButtonChecked] = useState(false);

    const itemType = () => {
        switch (type) {
            case 0:
                return "post";
            case 1:
                return "ewent";
            case 2:
                return "wužiwar";
            default:
                return "";
        }
    };

    let checkButton = () => {
        let inputValid = false;
        if (banData.description.length !== 0 && item) inputValid = true;
        setButtonChecked(inputValid);
    };

    useEffect(() => {
        checkButton();
    }, [banData]);

    const ban = () => {
        if (banning) return;

        Alert.alert(
            `Chceš "${type === 2 ? item.name : item.title}" banować?`,
            type !== 2
                ? `${itemType()} so banuje, nic wužiwar`
                : "Wužiwar a wšitke wozjewjenja so banuja",
            [
                {
                    text: "Ně",
                    style: "cancel",
                },
                {
                    text: "Haj",
                    style: "default",
                    isPreferred: true,
                    onPress: async () => {
                        banning = true;

                        const db = getDatabase();
                        // const id = Date.now();
                        const uid = await getData("userId").catch(() => {
                            return getAuth().currentUser.uid;
                        });

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
                                "Ban njebě wuspěšny",
                                "Problem je nastał při banowanju",
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
                                set(ref(db, `posts/${e}/isBanned`), true).catch(
                                    error =>
                                        console.log(
                                            "error pages/interaction/Ban.jsx",
                                            "ban set user posts banned",
                                            error.code
                                        )
                                )
                            );

                        // Ban Events
                        if (item.events ? true : false)
                            item.events.forEach(e =>
                                set(
                                    ref(db, `events/${e}/isBanned`),
                                    true
                                ).catch(error =>
                                    console.log(
                                        "error pages/interaction/Ban.jsx",
                                        "ban set user events banned",
                                        error.code
                                    )
                                )
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
                        title="Ban"
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
                    <Text style={[style.Ttitle, style.tWhite]}>
                        "{type === 2 ? item.name : item.title}" ({itemType()})
                        banować
                    </Text>

                    {/* Description */}
                    <View style={[styles.sectionContainer, style.pH]}>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginBottom: style.defaultMsm },
                            ]}>
                            Přidatne informacije zapodać:
                        </Text>
                        <TextField
                            placeholder="Dodaj informacije..."
                            value={banData.description}
                            inputAccessoryViewID={
                                "ban_Description_InputAccessoryViewID"
                            }
                            onChangeText={val => {
                                setBanData({
                                    ...banData,
                                    description: val,
                                });
                            }}
                        />
                    </View>

                    <View style={[style.allCenter, styles.button]}>
                        <EnterButton onPress={ban} checked={buttonChecked} />
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
        marginTop: style.defaultMlg,
    },
});
