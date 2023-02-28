import React, { useEffect, useState } from "react";
import {
    View,
    Pressable,
    StyleSheet,
    ScrollView,
    Text,
    Image,
} from "react-native";

import * as style from "../../styles";
import * as Account from "../../components/settings";

import { getDatabase, ref, child, get } from "firebase/database";

import SVG_Pencil from "../../assets/svg/Pencil";

import { convertTimestampToString } from "../../constants/time";

import BackHeader from "../../components/BackHeader";
import InputField from "../../components/InputField";
import DangerButton from "../../components/settings/DangerButton";

export default function Admin({ navigation }) {
    const [isUnlocked, setUnlocked] = useState({ 0: false, 1: false });
    const [logs, setLogs] = useState([]);

    const toggle = (input, index) => {
        import("../../constants/settings/data.js").then(ids => {
            const match =
                index === 0 ? ids.cyril_id === input : ids.korla_id === input;

            if (index === 0)
                setUnlocked(prev => {
                    return {
                        ...prev,
                        0: match,
                    };
                });
            else if (index === 1)
                setUnlocked(prev => {
                    return {
                        ...prev,
                        1: match,
                    };
                });
        });
    };

    useEffect(() => {
        if (isUnlocked && logs.length === 0)
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
    }, [isUnlocked]);

    // No Admin
    if (!(isUnlocked[0] && isUnlocked[1]))
        return (
            <View style={[style.container, style.bgBlack]}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        title={"Admin a moderator"}
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
                    <View style={[style.container, style.pH]}>
                        <Text style={[style.Ttitle, style.tWhite]}>
                            Tutón wobwuk je jenož za adminy a modertory!
                        </Text>

                        <View style={styles.sectionContainer}>
                            <InputField
                                icon={<SVG_Pencil fill={style.colors.sec} />}
                                placeholder={"Zapodaj hesło"}
                                onChangeText={val => toggle(val, 0)}
                                textContentType="password"
                                secureTextEntry
                            />
                            <View style={{ marginTop: style.defaultMmd }}>
                                <InputField
                                    icon={
                                        <SVG_Pencil fill={style.colors.sec} />
                                    }
                                    placeholder={"Zapodaj druhe hesło"}
                                    onChangeText={val => toggle(val, 1)}
                                    textContentType="password"
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={"Admin a moderator"}
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
                        Wobwuk za adminy a moderatory:
                    </Text>
                </View>

                {/* Server Offline */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        Serwer - Offline:
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Tutón wobwuk hasnje serwer na njeznaty čas. Wužiwarjo
                        njemóža na kostrjanc přistupić. Serwer ma so manuelnje
                        na online sadźić.
                    </Text>
                    <DangerButton
                        title={"Server na offline sadźić"}
                        style={{ marginTop: style.defaultMmd }}
                        onPress={() => Account.setServer("offline")}
                    />
                </View>

                {/* Server Pause */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        Serwer - Pause:
                    </Text>
                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        Tutón wobwuk hasnje serwer na podaty čas. Wužiwarjo
                        njemóža na kostrjanc přistupić. Serwer ma so tohodla
                        manuelnje na online sadźić. Čas je móžnosć pokazać, hdy
                        so předwidźa, zo serwer so zaso na online sadźi.
                    </Text>
                    <DangerButton
                        title={"Server na pause sadźić"}
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
