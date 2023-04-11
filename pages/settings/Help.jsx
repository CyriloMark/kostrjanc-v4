import React from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";

import { helpLinks } from "../../constants/settings";
import { openLink } from "../../constants";
import { getLangs } from "../../constants/langs";

import BackHeader from "../../components/BackHeader";
import OptionButton from "../../components/OptionButton";

import SVG_Web from "../../assets/svg/Web";

export default function Help({ navigation }) {
    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("settings_help_title")}
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
                <View>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_help_sub_0")}
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            styles.smallSectionContainer,
                        ]}>
                        {getLangs("settings_help_sub_1")}
                    </Text>
                </View>

                <View style={styles.sectionContainer}>
                    {helpLinks.map((link, key) => (
                        <View
                            key={key}
                            style={[
                                styles.smallSectionContainer,
                                styles.border,
                                style.border,
                            ]}>
                            <View style={style.pH}>
                                <Text
                                    style={[
                                        style.Tmd,
                                        style.tWhite,
                                        { marginBottom: style.defaultMsm },
                                    ]}>
                                    {getLangs(link.title)}
                                </Text>
                            </View>
                            <OptionButton
                                title={link.link}
                                icon={<SVG_Web fill={style.colors.white} />}
                                onPress={() => openLink(link.link)}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.sectionContainer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    smallSectionContainer: {
        width: "100%",
        marginTop: style.defaultMmd,
    },
    border: {
        borderColor: "transparent",
        borderBottomColor: style.colors.white,
    },
});
