import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
} from "react-native";

import * as style from "../../styles";

import * as Account from "../../components/settings";

import { User_Placeholder } from "../../constants/content/PlaceholderData";
import { getData } from "../../constants/storage";
import { getCurrentLanguage, getLangs } from "../../constants/langs";
import { openLink } from "../../constants";

import { child, get, getDatabase, ref } from "firebase/database";

import BackHeader from "../../components/BackHeader";
import WarnButton from "../../components/settings/WarnButton";
import OptionButton from "../../components/OptionButton";
import BuyMeACoffeeButton from "../../components/settings/BuyMeACoffeeButton";

import SVG_Recent from "../../assets/svg/Recent";
import SVG_Help from "../../assets/svg/Help";
import SVG_Moderator from "../../assets/svg/Moderator";
import SVG_Ban from "../../assets/svg/Ban";
import SVG_Admin from "../../assets/svg/Admin";
import SVG_Logout from "../../assets/svg/Logout";
import SVG_Basket from "../../assets/svg/Basket";
import * as flags from "../../assets/svg/flags";

export default function Landing({ navigation }) {
    const [userData, setUserData] = useState({
        uid: "",
        data: User_Placeholder,
    });
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        getUserData();
    }, []);

    let getUserData = async () => {
        setUserData({
            uid: await getData("userId").then(uid => {
                get(child(ref(getDatabase()), `users/${uid}/isAdmin`))
                    .then(isAdm => {
                        const val = isAdm.val();
                        if (val === null) setIsAdmin(false);
                        else setIsAdmin(val);
                    })
                    .catch(error =>
                        console.log(
                            "error compontents/settings/index.js",
                            "checkIfAdmin get isAdmin",
                            error.code
                        )
                    );
                return uid;
            }),
            data: await getData("userData"),
        });
    };

    let getFlag = () => {
        const curLang = getCurrentLanguage();
        if (curLang < 0) return flags.langs[0].flag;
        return flags.langs[curLang].flag;
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader
                    title={getLangs("settings_landing_title")}
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
                {false ? (
                    <BuyMeACoffeeButton
                        text={getLangs("settings_landing_bugbutton_title")}
                        sub={getLangs("settings_landing_bugbutton_sub")}
                        onPress={() =>
                            navigation.navigate("settings-buymeacoffee")
                        }
                    />
                ) : null}

                <WarnButton
                    text={getLangs("settings_landing_bugbutton_title")}
                    sub={getLangs("settings_landing_bugbutton_sub")}
                    onPress={() =>
                        openLink("https://kostrjanc.de/pages/pomoc.html")
                    }
                    style={{
                        marginHorizontal: style.defaultMmd * 2,

                        // Shadow
                        shadowColor: style.colors.red,
                        shadowRadius: 15,
                        shadowOpacity: 0.5,
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        backgroundColor: style.colors.black,
                        borderRadius: 10,
                    }}
                />

                {/* Client */}
                <View
                    style={{
                        width: "100%",
                        flexDirection: "column",
                        marginTop: style.defaultMmd,
                    }}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {getLangs("settings_landing_aplication_title")}
                    </Text>
                    <OptionButton
                        style={styles.optionButton}
                        icon={
                            <View
                                style={{
                                    aspectRatio: 1,
                                    height: "100%",
                                    borderRadius: 100,
                                    overflow: "hidden",
                                }}>
                                <View
                                    style={{
                                        transform: [
                                            {
                                                scale: 2,
                                            },
                                        ],
                                    }}>
                                    {getFlag()}
                                </View>
                            </View>
                        }
                        title={getLangs("settings_landing_aplication_lang")}
                        onPress={() =>
                            navigation.navigate("settings-language", {
                                uid: userData.uid,
                            })
                        }
                    />
                    <OptionButton
                        style={styles.optionButton}
                        icon={<SVG_Recent fill={style.colors.white} />}
                        title={getLangs(
                            "settings_landing_aplication_notifications"
                        )}
                        onPress={() =>
                            navigation.navigate("settings-notifications")
                        }
                    />
                </View>

                {/* about kostrjanc */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {getLangs("settings_landing_kostrjanc_title")}
                    </Text>
                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs("settings_landing_kostrjanc_help")}
                        icon={<SVG_Help fill={style.colors.white} />}
                        onPress={() => navigation.navigate("settings-help")}
                    />
                    {false ? (
                        <OptionButton
                            style={styles.optionButton}
                            icon={<SVG_Moderator fill={style.colors.white} />}
                            title={getLangs(
                                "settings_landing_kostrjanc_verify"
                            )}
                            onPress={() =>
                                navigation.navigate("settings-verify")
                            }
                        />
                    ) : null}
                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs(
                            "settings_landing_kostrjanc_datasecurityimpresum"
                        )}
                        icon={<SVG_Ban fill={style.colors.white} />}
                        onPress={() =>
                            navigation.navigate("settings-datasec&impresum")
                        }
                    />
                    {isAdmin === true ? (
                        <OptionButton
                            style={styles.optionButton}
                            icon={<SVG_Admin fill={style.colors.white} />}
                            title={getLangs("settings_landing_kostrjanc_admin")}
                            onPress={() =>
                                navigation.navigate("settings-admin")
                            }
                        />
                    ) : null}
                </View>

                {/* Account */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {getLangs("settings_landing_account_title")}
                    </Text>

                    {/* Account */}
                    <Pressable
                        style={[
                            style.Pmd,
                            style.border,
                            styles.optionButton,
                            styles.accountContainer,
                        ]}
                        onPress={() =>
                            navigation.navigate("settings-profile", {
                                uid: userData.uid,
                                userData: userData.data,
                            })
                        }>
                        <View
                            style={[
                                styles.accountImageContainer,
                                style.oHidden,
                            ]}>
                            <Image
                                style={[style.allMax]}
                                resizeMode="cover"
                                source={{ uri: userData.data.pbUri }}
                            />
                        </View>
                        <View style={styles.accountTextContainer}>
                            <Text style={[style.tWhite, style.TlgRg]}>
                                {userData.data.name}
                            </Text>
                            <Text
                                style={[
                                    style.tWhite,
                                    style.TsmLt,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {userData.uid}
                            </Text>
                        </View>
                    </Pressable>

                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs("settings_landing_account_logout")}
                        onPress={Account.logout}
                        icon={
                            <SVG_Logout
                                style={{
                                    transform: [
                                        {
                                            scaleX: -1,
                                        },
                                    ],
                                }}
                                fill={style.colors.red}
                            />
                        }
                        red
                    />
                    <OptionButton
                        style={styles.optionButton}
                        title={getLangs("settings_landing_account_delete")}
                        icon={<SVG_Basket fill={style.colors.red} />}
                        onPress={() =>
                            Account.deleteAccount(userData.uid, userData.data)
                        }
                        red
                    />
                </View>
                {/* End Account */}

                {/* Footer */}
                <View style={[styles.sectionContainer, style.allCenter]}>
                    {/* Zalozba za serbski Lud */}
                    <View style={[styles.stiftungContainer, style.allCenter]}>
                        <View style={[{ flex: 0.2 }, style.allCenter]}>
                            <Image
                                resizeMode="cover"
                                style={styles.stiftungImage}
                                source={require("../../assets/img/Stiftung-Logo-Small.png")}
                            />
                        </View>
                        <Text
                            style={[
                                style.TsmRg,
                                style.tWhite,
                                styles.stiftungText,
                            ]}>
                            Projekt spěchuje so wot{" "}
                            <Text style={{ fontFamily: "Barlow_Bold" }}>
                                Załožby za serbski lud
                            </Text>
                            , kotraž dóstawa lětnje přiražki z dawkowych srědkow
                            na zakładźe hospodarskich planow, wobzamknjenych wot
                            Zwjazkoweho sejma, Krajneho sejma Braniborskeje a
                            Sakskeho krajneho sejma.
                        </Text>
                    </View>
                    <Text
                        style={[
                            style.TsmLt,
                            style.tWhite,
                            style.tCenter,
                            { marginTop: style.defaultMlg },
                        ]}>
                        Version {require("../../app.json").expo.version}
                        {"\n"}
                        Produced by Mark, Cyril; Baier, Korla{"\n"}© 2022-2025
                        All Rights Reserved
                    </Text>
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
        flexDirection: "column",
    },

    optionButton: {
        width: "100%",
        marginTop: style.defaultMmd,
    },

    accountContainer: {
        borderRadius: 10,
        borderColor: style.colors.white,
        flexDirection: "row",
        alignItems: "center",
    },
    accountImageContainer: {
        aspectRatio: 1,
        flex: 1,
        maxWidth: 58,
        maxHeight: 58,
        borderRadius: 100,
    },
    accountTextContainer: {
        flexDirection: "column",
        marginLeft: style.defaultMmd,
        flex: 1,
    },

    stiftungContainer: {
        width: "100%",
        flexDirection: "row",
    },
    stiftungImage: {
        width: Dimensions.get("screen").width * 0.125,
        height: (Dimensions.get("screen").width * 0.125 * 7) / 4,
        borderRadius: 10,
    },
    stiftungText: {
        flex: 0.8,
        paddingLeft: style.defaultMsm,
    },
});
