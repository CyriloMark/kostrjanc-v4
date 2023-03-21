import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { langs } from "../../assets/svg/flags";

import { changeLanguage } from "../../constants/langs";
import { save } from "../../constants/storage/language";

import EnterButton from "../../components/auth/EnterButton";

export default function LanguageSelect({ onLanguageChange }) {
    const [currentLanguage, setCurrentLanguage] = useState(-1);

    const check = () => {
        onLanguageChange();
        save("currentLanguage", currentLanguage);
        changeLanguage(currentLanguage);
    };

    return (
        <SafeAreaView style={[style.container, style.bgBlack]}>
            <ScrollView
                style={[
                    style.container,
                    style.pH,
                    style.oVisible,
                    { marginTop: style.defaultMsm },
                ]}
                keyboardDismissMode="interactive"
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                <Text style={[style.Ttitle, style.tWhite]}>
                    {currentLanguage === 0
                        ? "Wuzwol sej rěč:"
                        : currentLanguage === 1
                        ? "Wuzwól sebje rěc:"
                        : currentLanguage === 2
                        ? "Wähle deine Sprache:"
                        : "Wuzwol sej rěč:"}
                </Text>

                <View style={[styles.langContainer]}>
                    {langs.map((lang, key) => (
                        <Pressable
                            key={key}
                            onPress={() => setCurrentLanguage(lang.id)}
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
                                <View style={styles.langFlag}>{lang.flag}</View>
                            </View>
                            <View style={styles.langText}>
                                <Text style={[style.tWhite, style.TsmRg]}>
                                    {lang.name}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>

                <View style={[style.allCenter, styles.sectionContainer]}>
                    <EnterButton
                        checked={currentLanguage !== -1}
                        onPress={check}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
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
        marginTop: style.defaultMlg,
        width: "100%",
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
