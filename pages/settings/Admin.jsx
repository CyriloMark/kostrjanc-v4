import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, ScrollView, Text } from "react-native";

import * as style from "../../styles";
import * as Account from "../../components/settings";

import { getDatabase, ref, child, get } from "firebase/database";

import { convertTimestampToString } from "../../constants/time";
import { getLangs } from "../../constants/langs";

// import Components
import BackHeader from "../../components/BackHeader";
import DangerButton from "../../components/settings/DangerButton";
import OptionButton from "../../components/OptionButton";

// import SVGs
import SVG_Warn from "../../assets/svg/Warn";

const LOGS_ENABLED = false;

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
                    // title={getLangs("settings_admin_title")}
                    title={""}
                    onBack={() => navigation.goBack()}
                    showReload={false}
                />
            </Pressable>

            <ScrollView
                style={[style.container, style.pH, style.oVisible]}
                keyboardDismissMode="interactive"
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                <View>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs("settings_admin_h2")}
                    </Text>
                </View>

                {/* Ranking Update */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        Ranking ewentow aktualisować
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Ranking ewentow na kostrjanc Studijo stronje ma so
                        (hišće) přeco manuelnje aktualisować. Přez tutón wobłuk
                        so hač do 100 najnowšich ewentow rankuja. Wotwisnje wot
                        wužiwarja so tute hišće filtruja, tak zo maja wužiwarjo
                        wosobiske doporučenja. Ranking je tohorunja městno,
                        hdźež pokazaja so najwoblubowaniše ewenty.
                    </Text>
                    <OptionButton
                        red
                        icon={<SVG_Warn fill={style.colors.red} />}
                        title={"Ranking ewentow aktualisować"}
                        style={{ marginTop: style.defaultMmd }}
                        onPress={() => Account.refreshEventRanking()}
                    />
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
                {LOGS_ENABLED ? (
                    <View style={styles.sectionContainer}>
                        <Text style={[style.TlgBd, style.tWhite]}>Logs:</Text>

                        <View style={{ marginTop: style.defaultMmd }}>
                            {logs.map((log, key) => (
                                <View
                                    style={[
                                        styles.logElementContainer,
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
                                                style={[
                                                    style.TsmLt,
                                                    style.tWhite,
                                                ]}>
                                                {log.target}
                                            </Text>
                                        ) : (
                                            <View
                                                style={{
                                                    flexDirection: "column",
                                                }}>
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
                                        {convertTimestampToString(
                                            log.timestamp
                                        )}
                                        {"\n"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : null}

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

    logElementContainer: {
        width: "100%",
        flexDirection: "column",
        borderColor: "transparent",
        borderBottomColor: style.colors.white,
        borderWidth: 1,
    },
});
