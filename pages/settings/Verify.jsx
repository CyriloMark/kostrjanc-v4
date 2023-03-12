import React from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";

import { verifyCriterias } from "../../constants/settings";
import { openLink } from "../../constants";
import { getLangs } from "../../constants/langs";

import BackHeader from "../../components/BackHeader";
import OptionButton from "../../components/OptionButton";

import SVG_Web from "../../assets/svg/Web";
import SVG_Verify from "../../assets/svg/Moderator";

export default function Verify({ navigation }) {
    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("settings_verify_title")}
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
                {/* Icon */}
                <View style={style.allCenter}>
                    <SVG_Verify fill={style.colors.blue} style={styles.icon} />
                </View>

                {/* Intro */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_verify_intro_title")}
                    </Text>

                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("settings_verify_intro_sub")}
                    </Text>
                </View>

                {/* Criterias */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_verify_criterias_title")}
                    </Text>

                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("settings_verify_criterias_sub")}
                    </Text>

                    {verifyCriterias.map((crit, key) => (
                        <View
                            key={key}
                            style={[style.pH, styles.criteriaListContainer]}>
                            <Text
                                style={[
                                    style.Tmd,
                                    style.tWhite,
                                    styles.criteriaCheck,
                                ]}>
                                -
                            </Text>
                            <Text
                                style={[
                                    style.Tmd,
                                    style.tWhite,
                                    { marginLeft: style.defaultMmd },
                                ]}>
                                {getLangs(crit)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Send Msg */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_verify_application_title")}
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("settings_verify_application_sub")}
                    </Text>

                    <OptionButton
                        style={{ marginTop: style.defaultMmd }}
                        red
                        title={getLangs("settings_verify_application_button")}
                        icon={<SVG_Web fill={style.colors.red} />}
                        onPress={() =>
                            openLink(
                                "https://kostrjanc.de/test/#/pomoc/formular#werifikacija"
                            )
                        }
                    />

                    <View style={styles.sectionContainer} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: "50%",
        aspectRatio: 1,
        maxWidth: 72,
        maxHeight: 72,
    },
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    criteriaListContainer: {
        marginTop: style.defaultMmd,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
    },
    criteriaCheck: {
        maxWidth: 24,
        maxHeight: 24,
    },
});
