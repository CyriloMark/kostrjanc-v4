import React from "react";
import { Pressable, View, StyleSheet, Text, Alert } from "react-native";

import * as style from "../../styles";

import BackHeader from "../../components/BackHeader";

import { getLangs } from "../../constants/langs";

import { LinearGradient } from "expo-linear-gradient";

import SVG_Post from "../../assets/svg/Post";
import SVG_Event from "../../assets/svg/Event";
import SVG_Return from "../../assets/svg/Return";

const POST_ENABLED = true;
const EVENT_ENABLED = false;

export default function LandingCreate({ navigation }) {
    const setErrorAlert = mode => {
        Alert.alert(
            getLangs("landingcreate_error_title"),
            mode === 0
                ? getLangs("landingcreate_error_sub_p")
                : mode === 1
                ? getLangs("landingcreate_error_sub_e")
                : "",
            [
                {
                    text: "Ok",
                    isPreferred: true,
                    style: "cancel",
                },
            ]
        );
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader title={""} onBack={() => navigation.goBack()} />
            </Pressable>

            <View style={[style.container, style.pH, style.oVisible]}>
                <View style={styles.titleContainer}>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs("landingcreate_title")}
                    </Text>
                </View>

                {/* Post */}
                <View style={[style.pH, styles.sectionContainer]}>
                    <Pressable
                        style={[styles.elementContainer, style.oHidden]}
                        onPress={() => {
                            if (POST_ENABLED) navigation.navigate("postCreate");
                            else setErrorAlert(0);
                        }}>
                        <LinearGradient
                            style={[styles.elementInnerContainer, style.Plg]}
                            colors={[style.colors.blue, style.colors.sec]}
                            locations={[0.2, 1]}
                            end={{
                                x: 1,
                                y: 0.5,
                            }}
                            start={{
                                x: 0.5,
                                y: -1,
                            }}>
                            <View style={styles.elementSection1}>
                                <SVG_Post
                                    style={styles.icon}
                                    fill={style.colors.white}
                                />
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Ttitle2,
                                        style.boxShadow,
                                        { marginVertical: style.defaultMmd },
                                    ]}>
                                    {getLangs("landingcreate_post_title")}
                                </Text>
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Tmd,
                                        style.boxShadow,
                                    ]}>
                                    {getLangs("landingcreate_post_sub")}
                                </Text>
                            </View>
                            <View style={styles.elementSection2}>
                                <SVG_Return
                                    fill={style.colors.white}
                                    style={styles.icon}
                                    rotation={1}
                                />
                            </View>
                        </LinearGradient>
                    </Pressable>
                </View>

                {/* Event */}
                <View style={[style.pH, styles.sectionContainer]}>
                    <Pressable
                        style={[styles.elementContainer, style.oHidden]}
                        onPress={() => {
                            if (EVENT_ENABLED)
                                navigation.navigate("eventCreate");
                            else setErrorAlert(1);
                        }}>
                        <LinearGradient
                            style={[styles.elementInnerContainer, style.Plg]}
                            colors={[
                                style.colors.white,
                                style.colors.red,
                                style.colors.white,
                            ]}
                            start={{ x: -1, y: -2.5 }}
                            end={{ x: 1.5, y: 3 }}
                            locations={[0, 0.5, 1]}>
                            <View style={[styles.elementSection1]}>
                                <SVG_Event
                                    style={styles.icon}
                                    fill={style.colors.white}
                                />
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Ttitle2,
                                        style.boxShadow,
                                        { marginVertical: style.defaultMmd },
                                    ]}>
                                    {getLangs("landingcreate_event_title")}
                                </Text>
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Tmd,
                                        style.boxShadow,
                                    ]}>
                                    {getLangs("landingcreate_event_sub")}
                                </Text>
                            </View>
                            <View style={styles.elementSection2}>
                                <SVG_Return
                                    fill={style.colors.white}
                                    style={styles.icon}
                                    rotation={1}
                                />
                            </View>
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "column",
        width: "100%",
        zIndex: 1,
    },
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 10,
    },

    elementContainer: {
        width: "100%",
        borderRadius: 10,
    },
    elementInnerContainer: {
        flexDirection: "row",
    },
    elementSection1: {
        flex: 0.8,
        justifyContent: "center",
        flexDirection: "column",
    },
    elementSection2: {
        flex: 0.2,
        ...style.allCenter,
    },
    elementCenterContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: style.defaultMmd,
    },
    icon: {
        width: 32,
        height: 32,
        ...style.boxShadow,
    },
});
