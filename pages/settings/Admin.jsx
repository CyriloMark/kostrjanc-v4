import React, { useEffect, useState } from "react";
import {
    View,
    Pressable,
    StyleSheet,
    ScrollView,
    Text,
    ActivityIndicator,
    Image,
    Alert,
} from "react-native";

import * as style from "../../styles";
import * as Account from "../../components/settings";
import * as Challenge from "../../constants/settings/challenge";

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
let CHALLENGE_RESULT_LOADING = false;
let CHALLENGE_RESET_LOADING = false;

export default function Admin({ navigation }) {
    const [logs, setLogs] = useState([]);

    const [challengeResult, setChallengeResult] = useState(null);
    const [loadingChallengeResult, setLoadingChallengeResult] = useState(false);
    const [loadingChallengeReset, setLoadingChallengeReset] = useState(false);

    // useEffect(() => {
    // get(child(ref(getDatabase()), `logs`))
    //     .then(logsSnap => {
    //         if (logsSnap.exists()) setLogs(logsSnap.val());
    //     })
    //     .catch(error =>
    //         console.log(
    //             "error pages/settings/Admin",
    //             "get logs",
    //             error.code
    //         )
    //     );
    // }, []);

    const onChallengeResultPress = async () => {
        if (CHALLENGE_RESULT_LOADING) return;
        CHALLENGE_RESULT_LOADING = true;
        setLoadingChallengeResult(true);

        Challenge.generateChallengeResult().then(result => {
            setChallengeResult(result);

            // Set Loading to false
            CHALLENGE_RESULT_LOADING = false;
            setLoadingChallengeResult(false);
        });
    };
    const onChallengeResetPress = async () => {
        if (CHALLENGE_RESET_LOADING) return;
        CHALLENGE_RESET_LOADING = true;
        setLoadingChallengeReset(true);

        Alert.alert(
            "Wubědźowanja wróćosadźić?",
            "Chceš ty woprawdźe tydźenske wubědźowanje wróćosadźić?",
            [
                {
                    text: getLangs("no"),
                    style: "destructive",
                    onPress: () => {
                        // Set Loading to false
                        CHALLENGE_RESET_LOADING = false;
                        setLoadingChallengeReset(false);
                    },
                },
                {
                    text: getLangs("yes"),
                    style: "default",
                    onPress: () =>
                        Challenge.resetChallenge(challengeResult).then(() => {
                            // Set Loading to false
                            CHALLENGE_RESET_LOADING = false;
                            setLoadingChallengeReset(false);

                            Alert.alert(
                                "Wuspěšne wróćosadźenje wubědźowanja",
                                "Posty wubědźowanja su so wšitke wotstronili. Tute so notnětka jako pod powšitkownych postow namakaja.",
                                [
                                    {
                                        text: "Ok",
                                        style: "default",
                                        isPreferred: true,
                                    },
                                ]
                            );
                        }),
                },
            ]
        );
    };

    const getCorrectLikeWord = amt => {
        if (amt === 1) return " like";
        else if (amt === 2) return " likeaj";
        else return " likei";
    };

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
                        Ranking ewentow aktualisować:
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
                        icon={<SVG_Warn fill={style.colors.red} old />}
                        title={"Ranking ewentow aktualisować"}
                        style={{ marginTop: style.defaultMmd }}
                        onPress={() => Account.refreshEventRanking()}
                    />
                </View>

                {/* Challenge Result */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        Wuslědki wubědźowanja wuličić:
                    </Text>
                    <OptionButton
                        red
                        icon={
                            !loadingChallengeResult ? (
                                <SVG_Warn fill={style.colors.red} old />
                            ) : (
                                <ActivityIndicator
                                    size={"small"}
                                    animating
                                    color={style.colors.red}
                                />
                            )
                        }
                        title={"Wuslědki wuličić"}
                        style={{ marginTop: style.defaultMmd }}
                        onPress={onChallengeResultPress}
                    />
                    <OptionButton
                        red
                        icon={
                            !loadingChallengeReset ? (
                                <SVG_Warn fill={style.colors.red} old />
                            ) : (
                                <ActivityIndicator
                                    size={"small"}
                                    animating
                                    color={style.colors.red}
                                />
                            )
                        }
                        title={"Wuslědki wróćosadźić"}
                        style={{
                            marginTop: style.defaultMmd,
                            opacity: challengeResult === null ? 0.5 : 1,
                        }}
                        onPress={onChallengeResetPress}
                    />
                    {challengeResult != null ? (
                        <View>
                            {/* // Hr */}
                            <View style={[styles.hr, style.bgWhite]} />
                            {/* // Results */}
                            <View style={style.container}>
                                <Text style={[style.Ttitle2, style.tBlue]}>
                                    Wuslědki tydźenskeho wubědźowanja:
                                </Text>

                                <View style={styles.challengeResultContainer}>
                                    {/* // Winner */}
                                    {challengeResult.length > 0 ? (
                                        <View
                                            style={[
                                                styles.challengeResultItemContainer,
                                                styles.first,
                                                style.allCenter,
                                            ]}>
                                            <Image
                                                style={
                                                    styles.challengeResultImage
                                                }
                                                source={{
                                                    uri: challengeResult[0]
                                                        .imgUri,
                                                }}
                                            />
                                            <Text
                                                style={[
                                                    style.tWhite,
                                                    style.TlgRg,
                                                    styles.challengeResultText,
                                                    styles.first,
                                                ]}>
                                                {challengeResult[0].userName}
                                            </Text>
                                            <Text
                                                style={[
                                                    style.Tmd,
                                                    style.tBlue,
                                                    styles.likesText,
                                                    {
                                                        fontFamily:
                                                            "RobotoMono_Thin",
                                                    },
                                                ]}>
                                                {
                                                    challengeResult[0].likes
                                                        .length
                                                }
                                                {getCorrectLikeWord(
                                                    challengeResult[0].likes
                                                        .length
                                                )}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <View
                                        style={[
                                            styles.challengeResultOtherContainer,
                                        ]}>
                                        {/* 2nd Place */}
                                        {challengeResult.length > 1 ? (
                                            <View
                                                style={[
                                                    styles.challengeResultOtherItem,
                                                    styles.second,
                                                ]}>
                                                <Image
                                                    style={
                                                        styles.challengeResultOtherImage
                                                    }
                                                    source={{
                                                        uri: challengeResult[1]
                                                            .imgUri,
                                                    }}
                                                />
                                                <Text
                                                    style={[
                                                        style.Tmd,
                                                        style.tWhite,
                                                        styles.challengeResultOtherText,
                                                        styles.second,
                                                    ]}>
                                                    {
                                                        challengeResult[1]
                                                            .userName
                                                    }
                                                </Text>
                                                <Text
                                                    style={[
                                                        style.TsmLt,
                                                        style.tBlue,
                                                        styles.likesText,
                                                        styles.second,
                                                    ]}>
                                                    {
                                                        challengeResult[1].likes
                                                            .length
                                                    }
                                                    {getCorrectLikeWord(
                                                        challengeResult[1].likes
                                                            .length
                                                    )}
                                                </Text>
                                            </View>
                                        ) : null}
                                        {/* 3rd Place */}
                                        {challengeResult.length > 2 ? (
                                            <View
                                                style={[
                                                    styles.challengeResultOtherItem,
                                                    styles.third,
                                                ]}>
                                                <Image
                                                    style={
                                                        styles.challengeResultOtherImage
                                                    }
                                                    source={{
                                                        uri: challengeResult[2]
                                                            .imgUri,
                                                    }}
                                                />
                                                <Text
                                                    style={[
                                                        style.Tmd,
                                                        style.tWhite,
                                                        styles.challengeResultOtherText,
                                                        styles.third,
                                                    ]}>
                                                    {
                                                        challengeResult[2]
                                                            .userName
                                                    }
                                                </Text>
                                                <Text
                                                    style={[
                                                        style.TsmLt,
                                                        style.tBlue,
                                                        styles.likesText,
                                                    ]}>
                                                    {
                                                        challengeResult[2].likes
                                                            .length
                                                    }
                                                    {getCorrectLikeWord(
                                                        challengeResult[2].likes
                                                            .length
                                                    )}
                                                </Text>
                                            </View>
                                        ) : null}
                                        {/* 4th Place */}
                                        {challengeResult.length > 3 ? (
                                            <View
                                                style={[
                                                    styles.challengeResultOtherItem,
                                                ]}>
                                                <Image
                                                    style={
                                                        styles.challengeResultOtherImage
                                                    }
                                                    source={{
                                                        uri: challengeResult[3]
                                                            .imgUri,
                                                    }}
                                                />
                                                <Text
                                                    style={[
                                                        style.Tmd,
                                                        style.tWhite,
                                                        styles.challengeResultOtherText,
                                                    ]}>
                                                    {
                                                        challengeResult[3]
                                                            .userName
                                                    }
                                                </Text>
                                                <Text
                                                    style={[
                                                        style.TsmLt,
                                                        style.tBlue,
                                                        styles.likesText,
                                                    ]}>
                                                    {
                                                        challengeResult[3].likes
                                                            .length
                                                    }
                                                    {getCorrectLikeWord(
                                                        challengeResult[3].likes
                                                            .length
                                                    )}
                                                </Text>
                                            </View>
                                        ) : null}
                                        {/* 5th Place */}
                                        {challengeResult.length > 4 ? (
                                            <View
                                                style={[
                                                    styles.challengeResultOtherItem,
                                                ]}>
                                                <Image
                                                    style={
                                                        styles.challengeResultOtherImage
                                                    }
                                                    source={{
                                                        uri: challengeResult[4]
                                                            .imgUri,
                                                    }}
                                                />
                                                <Text
                                                    style={[
                                                        style.Tmd,
                                                        style.tWhite,
                                                        styles.challengeResultOtherText,
                                                    ]}>
                                                    {
                                                        challengeResult[4]
                                                            .userName
                                                    }
                                                </Text>
                                                <Text
                                                    style={[
                                                        style.TsmLt,
                                                        style.tBlue,
                                                        styles.likesText,
                                                    ]}>
                                                    {
                                                        challengeResult[4].likes
                                                            .length
                                                    }
                                                    {getCorrectLikeWord(
                                                        challengeResult[4].likes
                                                            .length
                                                    )}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </View>
                            </View>
                            {/* // Hr */}
                            <View style={[styles.hr, style.bgWhite]} />
                        </View>
                    ) : null}
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

    hr: {
        width: "100%",
        marginVertical: style.defaultMlg,
        height: 1,
    },

    challengeResultContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        alignItems: "center",
        flexDirection: "column",
    },
    challengeResultItemContainer: {
        flexDirection: "column",
    },
    challengeResultImage: {
        width: 128,
        borderRadius: 10,
        aspectRatio: 1,
    },
    challengeResultText: {
        marginTop: style.defaultMsm,
    },

    challengeResultOtherContainer: {
        marginTop: style.defaultMlg,
        width: "100%",
        flexDirection: "row",
    },
    challengeResultOtherItem: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    challengeResultOtherImage: {
        width: 72,
        borderRadius: 10,
        aspectRatio: 1,
    },
    challengeResultOtherText: {
        marginTop: style.defaultMsm,
        textAlign: "center",
    },

    likesText: {
        marginTop: style.defaultMsm,
    },

    first: {
        overflow: "visible",

        shadowColor: "#ffc106",
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 25,
    },
    second: {
        overflow: "visible",

        shadowColor: "#C0C0C0",
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    third: {
        overflow: "visible",

        shadowColor: "#CD7F32",
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
});
