import React, { useState } from "react";
import {
    View,
    Pressable,
    StyleSheet,
    ScrollView,
    Text,
    Alert,
} from "react-native";

import * as style from "../../styles";

import BackHeader from "../../components/BackHeader";
import {
    getCurrentLanguage,
    changeLanguage,
    getLangs,
    getLangsSpecific,
} from "../../constants/langs";

import { langs } from "../../assets/svg/flags";
import { save } from "../../constants/storage/language";

export default function Language({ navigation }) {
    const [currentLanguage, setCurrentLanguage] = useState(
        getCurrentLanguage()
    );

    const onLanguageChange = id => {
        if (currentLanguage === id) return;
        Alert.alert(
            getLangsSpecific("settings_lang_changelang_alert_title", id),
            getLangsSpecific("settings_lang_changelang_alert_sub", id),
            [
                {
                    text: getLangsSpecific("no", id),
                    style: "destructive",
                    isPreferred: true,
                },
                {
                    text: getLangsSpecific("yes", id),
                    style: "default",
                    onPress: () => {
                        setCurrentLanguage(id);
                        changeLanguage(id);
                        save("currentLanguage", id);
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
                    title={getLangs("settings_lang_title")}
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
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                {/* Lang Select */}
                <View>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_lang_changelang_title")}
                    </Text>

                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMsm },
                        ]}>
                        {getLangs("settings_lang_changelang_sub")}
                    </Text>

                    <View style={styles.langContainer}>
                        {langs.map((lang, key) => (
                            <Pressable
                                key={key}
                                onPress={() => onLanguageChange(lang.id)}
                                style={[styles.langElementContainer]}>
                                <View
                                    style={[
                                        styles.langBorder,
                                        {
                                            borderColor:
                                                currentLanguage === lang.id
                                                    ? style.colors.red
                                                    : style.colors.blue,
                                        },
                                    ]}>
                                    <View style={styles.langFlag}>
                                        {lang.flag}
                                    </View>
                                </View>
                                <View style={styles.langText}>
                                    <Text style={[style.tWhite, style.TsmRg]}>
                                        {lang.name}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    langContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: style.defaultMmd,
    },
    langElementContainer: {
        flexDirection: "column",
        flex: 1,
        ...style.Psm,
    },
    langBorder: {
        ...style.border,
        padding: 2,
    },
    langFlag: {
        minWidth: 72,
        aspectRatio: 5 / 3,
    },
    langText: {
        ...style.allCenter,
        marginTop: style.defaultMsm,
    },
});
