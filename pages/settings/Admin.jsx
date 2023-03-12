import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";
import * as Account from "../../components/settings";

import { getDatabase, ref, child, get } from "firebase/database";

import { convertTimestampToString } from "../../constants/time";
import { getLangs } from "../../constants/langs";

import BackHeader from "../../components/BackHeader";
import DangerButton from "../../components/settings/DangerButton";

export default function Admin({ navigation }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        get(child(ref(getDatabase()), `logs`))
            .then(logsSnap => {
                if (logsSnap.exists()) setLogs(logsSnap.val());
            })
            .catch(error =>
                console.log(
                    "error pages/settings/Admin",
                    "get logs",
                    error.code
                )
            );
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("settings_admin_title")}
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
                <View style={style.container}>
                    <Text style={[style.Ttitle, style.tWhite]}>
                        {getLangs("settings_admin_h2")}
                    </Text>
                </View>

                {/* Server Offline */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_admin_offline_title")}
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("settings_admin_offline_sub")}
                    </Text>
                    <DangerButton
                        title={getLangs("settings_admin_offline_button")}
                        style={{ marginTop: style.defaultMmd }}
                        onPress={() => Account.setServer("offline")}
                    />
                </View>

                {/* Server Pause */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("settings_admin_pause_title")}
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("settings_admin_pause_sub")}
                    </Text>
                    <DangerButton
                        title={getLangs("settings_admin_pause_button")}
                        style={{ marginTop: style.defaultMmd }}
                        onPress={() => Account.setServer("pause")}
                    />
                </View>

                {/* Logs */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>Logs:</Text>

                    <View style={{ marginTop: style.defaultMmd }}>
                        {logs.map((log, key) => (
                            <View
                                style={[
                                    styles.logElementContainer,
                                    style.container,
                                    key != logs.length - 1
                                        ? { marginBottom: style.defaultMmd }
                                        : null,
                                ]}
                                key={key}>
                                <Text style={[style.tWhite, style.TsmLt]}>
                                    Aktion: {log.action}
                                    {"\n"}
                                    Moderator: {log.mod}
                                    {"\n"}
                                    Target:
                                    {"\n"}
                                    {log.action !== "user_banned" ? (
                                        <Text
                                            style={[style.TsmLt, style.tWhite]}>
                                            {log.target}
                                        </Text>
                                    ) : (
                                        <View
                                            style={{ flexDirection: "column" }}>
                                            {log.target.map((t, k) => (
                                                <Text
                                                    style={[
                                                        style.TsmLt,
                                                        style.tWhite,
                                                    ]}
                                                    key={k}>
                                                    {t}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                    {"\n"}
                                    Timestamp:{" "}
                                    {convertTimestampToString(log.timestamp)}
                                    {"\n"}
                                </Text>
                            </View>
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

    logElementContainer: {
        flexDirection: "column",
        borderColor: "transparent",
        borderBottomColor: style.colors.white,
        borderWidth: 1,
    },
});
